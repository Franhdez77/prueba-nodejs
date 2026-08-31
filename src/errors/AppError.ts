/** Expected application error that carries the HTTP status returned to the client. */
export class AppError extends Error {
  /**
   * @param statusCode HTTP status code that should be returned to the client.
   * @param message Safe error message for the response body.
   */
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
  }
}
