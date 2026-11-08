/**
 * Helper utilities untuk memicu status loading fetch / sinkronisasi data
 * secara global di seluruh aplikasi (Astro & React).
 */

export const startFetchLoading = (message?: string, subMessage?: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('data-fetch:start', {
        detail: { message, subMessage },
      })
    );
  }
};

export const stopFetchLoading = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('data-fetch:end'));
  }
};

export const withFetchLoading = async <T,>(
  asyncFn: () => Promise<T>,
  message: string = 'Tunggu sebentar',
  subMessage?: string
): Promise<T> => {
  startFetchLoading(message, subMessage);
  try {
    return await asyncFn();
  } finally {
    setTimeout(() => {
      stopFetchLoading();
    }, 350);
  }
};

