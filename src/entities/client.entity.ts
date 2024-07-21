export class Client {
  public id: string;
  public name: string;
  public phoneNumber: string;
  public linkFacebook: string;

  constructor(
    id: string,
    name: string,
    phoneNumber: string,
    linkFacebook: string
  ) {
    this.id = id;
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.linkFacebook = linkFacebook;
  }
}
