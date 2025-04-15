export interface MessageQuery {
  condition: string,
  value?: string;
  startValue?: string;
  endValue?: string;

}
export interface MessagesArr {
  key: string,
  query: MessageQuery[]
}
