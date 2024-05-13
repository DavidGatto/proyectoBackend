class UserDTO {
  constructor(firstName, lastName, age, email, role) {
    this.first_name = firstName;
    this.last_name = lastName;
    this.age = age;
    this.email = email;
    this.role = role;
  }
}

module.exports = UserDTO;
