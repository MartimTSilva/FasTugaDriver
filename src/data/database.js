export const database = {
  findUserByEmail,
  findUserByID,
  users: [
    {
      id: 1,
      name: "Jonh Doe",
      email: "driver@gmail.com",
      password: "123",
      tel: "913212000",
      plate: "42-AZ-50",
    },
    {
      id: 2,
      name: "Judith Doe",
      email: "judith@gmail.com",
      password: "123",
      tel: "962000454",
      plate: "AB-25-DO",
    },
  ],
};

function findUserByEmail(email) {
  return database.users.find((x) => x.email === email);
}

function findUserByID(id) {
  return database.users.find((x) => x.id === id);
}