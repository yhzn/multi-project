import 'babel-polyfill'
import '../css/index.css'
import '../css/style.less'

// 还需要在主要的js文件里写入下面这段代码
if (module.hot) {
    // 实现热更新
    module.hot.accept();
}
