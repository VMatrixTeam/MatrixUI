## mu-radio

### Usage

```html
<mu-radio-group name="sex" ng-model="selected">
  <mu-radio ng-value="male" size="small"></mu-radio>
</mu-radio-group>
<mu-radio-group name="color" >
  <mu-radio ng-value="blue" size="small"></mu-radio>
  <mu-radio ng-value="red" size="small" checked></mu-radio>
</mu-radio-group>
```

### Docs

参数：ng-value
* 表单radio的固有属性，不解释

参数：name
* 表单radio的固有属性，不解释

参数：size
* 设置radio的大小
* **small** 小
* **big** 大

参数: ng-model
* 与angular数据的双向绑定

参数: checked
* 使得该radio初始被选中，但在ng-model被设置时无效
