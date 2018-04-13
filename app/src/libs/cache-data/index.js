export default {
  install: function (Vue, options) {
    function toString (value) {
      if (typeof value === 'object') {
        return JSON.stringify(value);
      }
      return value;
    }

    function toObject (datastr) {
      var obj = datastr;
      if (datastr) {
        try {
          obj = JSON.parse(datastr);
        } catch (e) {
          obj = datastr;
        }
      } else {
        return '';
      }
      return obj;
    }
    // 逻辑...
    // 1. 添加全局方法或属性 type:'local' 'session'
    Vue.setCache = function (key, value, type) {
      // 逻辑...
      if (type === 'local') {
        localStorage.setItem(key, toString(value));
      } else {
        sessionStorage.setItem(key, toString(value));
      }
    };
    Vue.getCache = function (key, type) {
      if (type === 'local') {
        return toObject(localStorage.getItem(key));
      } else if (type === 'session') {
        return toObject(sessionStorage.getItem(key));
      }
      return '';
    };

    console.log('@@##cache-data loaded');

    // 2. 添加全局资源
    // Vue.directive('my-directive', {
    //   bind(el, binding, vnode, oldVnode) {
    //     // 逻辑...
    //   }
    // });
    // 3. 注入组件
    Vue.mixin({
      created: function () {
        // 逻辑...
        // console.log('@@##cache-data created');
      }
    });
    // 4. 添加实例方法
    Vue.prototype.testCache = function (options) {
      // 逻辑...
      console.log('@@##zhaizy testCache object!');
    };
  }
};
