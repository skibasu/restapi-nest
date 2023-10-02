export enum UsersFields {
  SELECTED_BY = 'selectedBy',
  ADDED_BY = 'addedBy',
  ACCEPTED_BY = 'acceptedBy',
}
export const populateUserOrder = (path: UsersFields) => {
  const set = [
    UsersFields.SELECTED_BY,
    UsersFields.ACCEPTED_BY,
    UsersFields.ACCEPTED_BY,
  ];
  if (set.includes(path)) {
    return {
      path,
      select: ['firstName', 'lastName', 'avatar', 'phoneNumber', 'role'],
    };
  }
  return {};
};
