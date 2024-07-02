/* eslint-disable @typescript-eslint/no-explicit-any */
class Logger {
  private sequence = 0;

  info(msg: string, ...info: any) {
    console.info(
      `[${new Date().toLocaleString()}] I Sequence-${
        this.sequence
      }-${msg}-${JSON.stringify(info)}`,
    );
    ++this.sequence;
  }

  error(msg: string, ...err: any) {
    console.error(
      `[${new Date().toLocaleString()}] E Sequence-${
        this.sequence
      }-${msg}-${JSON.stringify(err)}`,
    );
    ++this.sequence;
  }
}
export const logger = new Logger();
