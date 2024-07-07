class User {
  constructor(id, userName, firstName, lastName, password, passwordSalt, registerDate, lastLoginDate) {
    this.id = id;
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.passwordSalt = passwordSalt;
    this.registerDate = registerDate;
    this.lastLoginDate = lastLoginDate;
  }
}

module.exports = User;
