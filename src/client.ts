const BASE_URL = "https://api.boxberry.ru/json.php";
const TIMEOUT = 15_000;

export class BoxberryClient {
  private token: string;

  constructor() {
    this.token = process.env.BOXBERRY_TOKEN ?? "";
    if (!this.token) {
      throw new Error(
        "Переменная окружения BOXBERRY_TOKEN обязательна. " +
        "Получите токен в личном кабинете Boxberry."
      );
    }
  }

  async call(method: string, params?: Record<string, string>): Promise<unknown> {
    const query = new URLSearchParams({ token: this.token, method, ...params });
    const url = `${BASE_URL}?${query.toString()}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Boxberry HTTP ${response.status}: ${text}`);
      }

      const data = await response.json();

      if (data && typeof data === "object" && "err" in data && (data as Record<string, unknown>).err) {
        throw new Error(`Boxberry: ${(data as Record<string, unknown>).err}`);
      }

      return data;
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("Boxberry: таймаут запроса (15 секунд). Попробуйте позже.");
      }
      throw error;
    }
  }
}
