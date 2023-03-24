export type AddressType = {
  id?: string,
  consigneeName: string,
  consigneeMobile: string,
  province: string,
  city: string,
  area: string,
  detailAddress: string,
  zipCode: string, // 邮政编码
  defaulted?: number,
  createTime?: string,
  updateTime?: string,
  buyerUsername?: string,
}
