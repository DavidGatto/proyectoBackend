class UserDTO {
  constructor(firstName, lastName, age, email, role, id) {
    this.first_name = firstName;
    this.last_name = lastName;
    this.age = age;
    this.email = email;
    this.role = role;
    this._id = id;
  }
}

export default UserDTO;
