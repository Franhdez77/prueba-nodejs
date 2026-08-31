/** Error controlado que conserva el código HTTP que debe recibir el cliente. */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
  }
}
