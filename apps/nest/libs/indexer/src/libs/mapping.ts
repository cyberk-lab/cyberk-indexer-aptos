interface AptosEventField {
  name: string
  type: string
}

export const aptosTypesToOrm = (field: AptosEventField) => {
  const { name, type } = field
  // if (type.includes('Option')) {
  //     return {
  //         [name]: {
  //             type: 'varchar',
  //         }
  //     }
  // }
}
