import React, {
  useRef,
  useCallback,
  useEffect,
  Children,
} from 'react';
import type { ReactNode } from 'react';

export interface ScrollStackItemProps {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  className = '',
  itemClassName = '',
}) => {
  return (
    <div className={`scroll-stack-card w-full ${itemClassName} ${className}`.trim()}>
      {children}
    </div>
  );
};

export interface ScrollStackProps {
  children: ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string | number;
  scaleEndPosition?: string | number;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

export default function ScrollStack({
  children,
  className = '',
  itemDistance = 160,
  itemScale = 0.04,
  itemStackDistance = 26,
  stackPosition = '16%',
  scaleEndPosition = '8%',
  baseScale = 0.88,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 1.5,
  useWindowScroll = true,
  onStackComplete,
}: ScrollStackProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const wrappersRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const lastTransformsRef = useRef<
    Map<
      number,
      {
        translateY: number;
        scale: number;
        rotation: number;
        blur: number;
        opacity: number;
      }
    >
  >(new Map());
  const isUpdatingRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const stackCompletedRef = useRef(false);

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback(
    (value: string | number, containerHeight: number) => {
      if (typeof value === 'string' && value.includes('%')) {
        return (parseFloat(value) / 100) * containerHeight;
      }
      return typeof value === 'number' ? value : parseFloat(value as string);
    },
    []
  );

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY || document.documentElement.scrollTop,
        containerHeight: window.innerHeight,
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller ? scroller.scrollTop : 0,
        containerHeight: scroller ? scroller.clientHeight : window.innerHeight,
      };
    }
  }, [useWindowScroll]);

  const getWrapperOffset = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    return rect.top + scrollTop;
  }, []);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const scroller = scrollerRef.current;
    const endElement = scroller?.querySelector('.scroll-stack-end') as HTMLElement | null;
    const endElementTop = endElement ? getWrapperOffset(endElement) : 0;

    const totalCards = cardsRef.current.length;
    let topCardIndex = -1;

    // First pass: determine the current active top card in the stack
    for (let j = 0; j < totalCards; j++) {
      const wrapper = wrappersRef.current[j];
      if (!wrapper) continue;
      const cardTop = getWrapperOffset(wrapper);
      const jPinStart = cardTop - stackPositionPx - itemStackDistance * j;
      if (scrollTop >= jPinStart) {
        topCardIndex = j;
      }
    }

    let allStacked = topCardIndex === totalCards - 1;
    if (allStacked && !stackCompletedRef.current) {
      stackCompletedRef.current = true;
      onStackComplete?.();
    } else if (!allStacked) {
      stackCompletedRef.current = false;
    }

    // Second pass: apply transform, scale, blur, and translateY to each card
    cardsRef.current.forEach((card, i) => {
      const wrapper = wrappersRef.current[i];
      if (!card || !wrapper) return;

      const cardTop = getWrapperOffset(wrapper);
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const lastCardHeight = cardsRef.current[totalCards - 1]?.offsetHeight || 320;
      const pinEnd = endElementTop - lastCardHeight - stackPositionPx - itemStackDistance * (totalCards - 1);

      // Pin translation calculation
      let translateY = 0;
      if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      // Depth calculations for cards beneath the active top card
      let scale = 1;
      let blur = 0;
      let opacity = 1;
      let rotation = 0;

      if (i < topCardIndex) {
        const depthInStack = topCardIndex - i;
        scale = Math.max(baseScale, 1 - depthInStack * itemScale);
        blur = blurAmount > 0 ? depthInStack * blurAmount : 0;
        opacity = Math.max(0.72, 1 - depthInStack * 0.1);
        if (rotationAmount) {
          rotation = (i % 2 === 0 ? 1 : -1) * (depthInStack * rotationAmount);
        }
      } else if (i === topCardIndex) {
        // Active top card
        scale = 1;
        blur = 0;
        opacity = 1;
        rotation = 0;
      } else {
        // Approaching card (not yet pinned)
        scale = 1;
        blur = 0;
        opacity = 1;
        rotation = 0;
      }

      const newTransform = {
        translateY: Math.round(translateY * 10) / 10,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 10) / 10,
        opacity: Math.round(opacity * 100) / 100,
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.5 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.002 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1 ||
        Math.abs(lastTransform.opacity - newTransform.opacity) > 0.01;

      if (hasChanged) {
        card.style.transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        card.style.filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : 'none';
        card.style.opacity = `${newTransform.opacity}`;
        card.style.zIndex = `${10 + i}`;
        lastTransformsRef.current.set(i, newTransform);
      }
    });

    isUpdatingRef.current = false;
  }, [
    getScrollData,
    getWrapperOffset,
    parsePercentage,
    stackPosition,
    scaleEndPosition,
    itemStackDistance,
    itemScale,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
  ]);

  const handleScroll = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(() => {
      updateCardTransforms();
    });
  }, [updateCardTransforms]);

  useEffect(() => {
    const target = useWindowScroll ? window : scrollerRef.current;
    if (!target) return;

    target.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    // Initial update
    const initTimer = setTimeout(() => {
      updateCardTransforms();
    }, 100);

    return () => {
      target.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(initTimer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleScroll, updateCardTransforms, useWindowScroll]);

  const childArray = Children.toArray(children);

  return (
    <div
      ref={scrollerRef}
      className={`scroll-stack-container relative w-full ${className}`.trim()}
    >
      {childArray.map((child, index) => {
        const isLast = index === childArray.length - 1;
        return (
          <div
            key={index}
            ref={(el) => {
              wrappersRef.current[index] = el;
            }}
            className="scroll-stack-wrapper relative w-full"
            style={{
              marginBottom: isLast ? 0 : `${itemDistance}px`,
            }}
          >
            <div
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="scroll-stack-card will-change-transform transition-shadow duration-300 transform-gpu"
              style={{
                transformOrigin: 'top center',
              }}
            >
              {child}
            </div>
          </div>
        );
      })}

      {/* End Sentinel to unpin cards once stack section concludes */}
      <div
        className="scroll-stack-end w-full pointer-events-none"
        style={{
          height: '1px',
          marginTop: `${itemDistance * 0.8}px`,
        }}
      />
    </div>
  );
}
