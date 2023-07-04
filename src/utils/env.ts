const debug = import.meta.env.MODE !== 'production';

export default debug;

// import.meta.env.MODE 是一个元数据对象，其中包含了有关当前模块的环境信息。
// 通过判断 import.meta.env.MODE 是否等于 'production'，可以确定当前的运行环境是否为生产环境。

// 如果 import.meta.env.MODE 的值为 'production'，
// 则将 debug 的值设置为 false，表示当前为生产环境，不处于调试模式。
// 如果 import.meta.env.MODE 的值不是 'production'，
// 则将 debug 的值设置为 true，表示当前为非生产环境，处于调试模式。
