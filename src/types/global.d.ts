declare global {
  /**
   * 分页查询参数
   */
  interface PageQuery {
    pageNum: number;
    pageSize: number;
  }

  /**
   * 分页响应对象
   */
  interface PageResult<T> {
    /**
     * 数据列表
     */
    list: T;
    /**
     * 数据总数
     */
    total: number;
  }

  /**
   * 弹窗属性
   */
  interface DialogOption {
    /**
     * 弹窗标题
     */
    title?: string;
    /**
     * 是否显示
     */
    visible: boolean;
  }
  /**
   * 组件数据源
   */
  interface OptionType {
    /**
     * 值
     */
    value: number;
    /**
     * 文本
     */
    label: string;
    /**
     * 子列表
     */
    children?: OptionType[];
  }
  interface DialogType  {
    title: string;
    visible: boolean;
  }

  type Product = {
    id: number,
    name: string,
    categoryId?: number,
    categoryName?: string,
    originPrice: number,
    sales?: number,
    picUrl?: string,
    album?: string[],
    status?: number,
    stock?: number, // 库存
    seller?: string,
    detail?: string,
    [key: string]: any
  }
  // "unit": null,
  //   "description": "111",
  //   "status": 0,
  //   "createTime": "2023-03-20T13:23:25.000+00:00",
  //   "updateTime": null,
  //   "stock": 10,
  //   "seller": "admin",
  //   "detail": null
  type CartItem = {
    id?: string,
    buyerUsername: string
    count: number,
    selected: boolean,
    handicrafts: Product
  }

}
export {};
