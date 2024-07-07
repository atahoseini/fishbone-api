class Order {
  constructor(id, userId, userName, firstName, lastName, productId, productName, productDescription, productPrice, orderQuantity, orderTotal, orderDate, orderDescription) {
    this.id = id;
    this.userId = userId;
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.productId = productId;
    this.productName = productName;
    this.productDescription = productDescription;
    this.productPrice = productPrice;
    this.orderQuantity = orderQuantity;
    this.orderTotal = orderTotal;
    this.orderDate = orderDate;
    this.orderDescription = orderDescription;
  }
}

module.exports = Order;
