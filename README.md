# combobox
## combobox jquery plugin
---javascript
 $('#e2').combobox({
                    name: 'name2',
                    value: null,
                    data: [{value: 1, text: 'test item1'}, {value: 2, text: 'test item2'}],
                    onUnknownValue: function (text) {
                        var newItemValue = String(Math.random()).split('.')[1];
                        $(this).combobox('addData', {text: text, value: newItemValue}) //добавление пункиа которого не существует
                                .combobox('setVal', newItemValue); //установить значение новое

                    }
                });

         