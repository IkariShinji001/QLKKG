export class Product {
  public id: string;
  public clientId: string;
  public name: string;
  public price: number;
  public discount: number;
  public sale_status: boolean;
  public discount_status: boolean;

  constructor(
    id: string,
    name: string,
    price: number,
    discount: number,
    clientId: string
  ) {
    this.id = id;
    this.clientId = clientId;
    this.name = name;
    this.price = price;
    this.discount = discount;
    this.sale_status = false;
    this.discount_status = false;
  }
}
