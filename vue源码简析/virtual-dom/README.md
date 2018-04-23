[简单实现一个 Virtual DOM](https://github.com/funnycoderstar/simple-virtual-dom)

# diff算法

相对于树的diff算法,时间复杂度要达到o(n^3),这对于用户端显然是不能接受的,而Vue及react基于几个基础的假设,将时间复杂度优化为o(n)

假设
- 1.Web UI中DOM节点跨层级的移动操作特别少,可以忽略不计
- 2.拥有相同类的两个组件将会生成相似的树形结构,拥有不同类的两个组件将会生成不同的树形结构
- 3.对应同一层级的一组节点,他们可以通过唯一id区分
