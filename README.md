# angular-validate-on
adds validateOn to ng-model-options 

```html
<div>
  <form name="myForm"
    ng-model-options="{ updateOn: 'submit', validateOn: 'default' }">
    name: <input type="text" name="name" ng-model="name"
      ng-minlength="4" ng-maxlength="6">
    <span class="error" ng-show="myForm.name.$error.minlength">
      Too short!</span>
    <span class="error" ng-show="myForm.name.$error.maxlength">
      Too long!</span><br>
  </form>
  <hr>
  <tt>user = {{name}}</tt><br/>
  <tt>myForm.name.$valid = {{myForm.name.$valid}}</tt><br>
  <tt>myForm.name.$error = {{myForm.name.$error}}</tt><br>
</div>
```

License: MIT
