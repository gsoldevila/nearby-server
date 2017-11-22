'use strict';

module.exports = class User {
  constructor(id, alias, firstName = 'John', lastName = 'Doe') {
    this.id = id;
    this.alias = alias;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
