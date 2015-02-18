(function ($) {

    var namePlugin = 'combobox';

    var methods = {
        init: function (options) {
            options = $.extend({
                name: null,
                value: null,
                allowEmpty: true, //разрешить установку пустого значения
                onUnknownValue: function (text) {
                    return false;
                }, //функция срабатываемая при вводе значения которого нет в списке data, если возвращяет false 
                //то отменяеться установка значения
                inputAttr: "", //дополнительные атрибуты текстового поля в виде строки
                data: []
            }, options);


            return this.each(function () {
                var $this = $(this);
                var data = $this.data(namePlugin);

                if (!data) {

                    var id = $this.attr('id');

                    if ($this.is('select'))
                    {
                        if (options.data.length == 0)
                        {
                            $this.find('option').each(function () {
                                options.data.push({text: $(this).text(), value: $(this).attr('value')});
                            });
                        }
                        if (options.value === null)
                        {
                            options.value = $this.val();
                        }
                        if (options.name === null)
                        {
                            options.name = $this.attr('name');
                        }
                        var newThis = $('<div class="idsite-combobox"></div>');
                        if (id)
                        {
                            newThis.attr('id', id);
                        }

                        $this.replaceWith(newThis);
                        $this = newThis;

                    } else
                    {
                        $this.addClass('idsite-combobox');
                    }

                    $this.html('<div class="idsite-combobox-input-c"><input class="idsite-combobox-text"  type="text" value="" ' + options.inputAttr + ' ></div><ul></ul><input class="idsite-combobox-val" type="hidden" name="' + options.name + '" value="">');
                    $this.addClass('idsite-combobox-ul-hide');
                    var inputText = $this.find('.idsite-combobox-text');


                    $this.find('.idsite-combobox-input-c').click(function () {
                        // methods._showUl.apply($this);
                        inputText.focus();
                    });

                    inputText.on('keyup', function (e) {

                        if (e.key == 'Down' || e.keyCode == 40)
                        {
                            methods._selectDown.apply($this);
                        } else if (e.key == 'Up' || e.keyCode == 38)
                        {
                            methods._selectUp.apply($this);
                        } else if (e.key == 'Enter' || e.keyCode == 13)
                        {
                            $this.find('li.idsite-combobox-li-select').mousedown();
                        } else
                        {

                            var val = $.trim($(this).val().toLowerCase());
                            var data2 = [];
                            for (var i = 0; i < options.data.length; i++)
                            {
                                if (val == '' || options.data[i].text.toLowerCase().indexOf(val) !== -1)
                                {
                                    data2.push(options.data[i]);
                                }
                            }

                            if (data2.length)
                            {
                                methods._showUl.apply($this);
                            } else
                            {
                                methods._hideUl.apply($this);
                            }

                            methods._renderData.apply($this, [data2]);


                        }

                    }).keypress(function (e) {
                        if (e.key == 'Enter' || e.keyCode == 13)
                        {
                            return false;
                        }
                    }).focus(function () {
                        methods._showUl.apply($this);
                    }).blur(function () {
                        methods._hideUl.apply($this);
                    }).change(function () {
                        var val = $.trim($(this).val().toLowerCase());
                        if (val === '')
                        {
                            if (options.allowEmpty)
                            {
                                methods.setVal.apply($this, [null]);
                            } else
                            {
                                $(this).val(methods._getTextByValue.apply($this, [methods.getVal.apply($this)]));
                            }
                        } else
                        {
                            var data = options.data;
                            var i = 0;
                            while (i < data.length && data[i].text !== val)
                                i++;
                            if (i < data.length)
                            {
                                methods.setVal.apply($this, [data[i].value]);
                                $(this).val(data[i].text);
                            } else
                            {
                                if (options.onUnknownValue.apply($this, [$(this).val()]) === false)
                                {
                                    $(this).val(methods._getTextByValue.apply($this, [methods.getVal.apply($this)]));
                                }
                            }
                        }

                    });

                    $this.on('mousedown', 'ul>li', function () {
                        var value = $(this).data('value');
                        inputText.val(methods._getTextByValue.apply($this, [value]));
                        methods.setVal.apply($this, [value]);
                        methods._hideUl.apply($this);
                        return false;
                    });

                    $this.data(namePlugin, {
                        target: $this,
                        options: options
                    });


                    methods._renderData.apply($this, [options.data]);
                    methods.setVal.apply($this, [options.value, false]);

                }
            });
        },
        setData: function (data) {
            return this.each(function () {
                var $this = $(this);
                var data = $this.data(namePlugin);
                data.options.data = data;
                methods._renderData.apply($this, [data.options.data]);
            });
        },
        addData: function (item) {
            return this.each(function () {
                var $this = $(this);
                var data = $this.data(namePlugin);
                data.options.data.push(item);
                methods._renderData.apply($this, [data.options.data]);
            });
        },
        setVal: function (value, onEvent) {
            onEvent = onEvent === undefined ? true : onEvent;
            return this.each(function () {
                var $this = $(this);

                $this.data(namePlugin).options.value = value;

                $this.find('ul>li').removeClass('idsite-combobox-active').each(function () {
                    if ($(this).data('value') === value)
                    {
                        $(this).addClass('idsite-combobox-active');
                    }
                });
                var inp = $this.find('.idsite-combobox-val');

                if (inp.val() != value)
                {
                    inp.val(value);
                    if (onEvent)
                    {
                        $this.trigger('change.' + namePlugin, [value]);
                    }
                }

            });
        },
        getVal: function () {
            return this.data(namePlugin).options.value;
        },
        _getTextByValue: function (value) {
            var data = this.data(namePlugin).options.data;
            for (var i = 0; i < data.length; i++)
            {
                if (data[i].value == value)
                {
                    return data[i].text;
                }
            }
            return false;
        },
        _showUl: function () {
            this.addClass('idsite-combobox-ul-show').removeClass('idsite-combobox-ul-hide');
            this.find('ul').scrollTop(0);
        },
        _hideUl: function () {
            this.addClass('idsite-combobox-ul-hide').removeClass('idsite-combobox-ul-show');
        },
        _renderData: function (data)
        {
            return this.each(function () {
                var $this = $(this);
                var ul = $this.find('ul');
                var selectLiVal = ul.find('.idsite-combobox-li-select').data('value');
                var htmlItems = '';
                for (var i = 0; i < data.length; i++)
                {
                    htmlItems += '<li data-value="' + data[i].value + '"  ' + (selectLiVal !== undefined && selectLiVal == data.value ? 'class="idsite-combobox-li-select"' : '') + '>' + data[i].text + '</li>';
                }

                ul.html(htmlItems);

            });

        },
        _selectDown: function () {
            var li = this.find('ul>li');
            var i = li.index(this.find('li.idsite-combobox-li-select'));

            if (i === -1 || i + 1 === li.length)
            {
                i = 0;

            } else
            {
                i++;
            }

            li.removeClass('idsite-combobox-li-select');
            li.eq(i).addClass('idsite-combobox-li-select');
        },
        _selectUp: function () {
            var li = this.find('ul>li');
            var i = li.index(this.find('li.idsite-combobox-li-select'));

            if (i === -1 || i === 0)
            {
                i = li.length - 1;

            } else
            {
                i--;
            }

            li.removeClass('idsite-combobox-li-select');
            li.eq(i).addClass('idsite-combobox-li-select');
        },
        destroy: function ( ) {
            return this.each(function () {
                $(window).unbind('.' + namePlugin);
                $(this).removeData(namePlugin);
            });
        }
    };
    $.fn[namePlugin] = function (method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Метод с именем ' + method + ' не существует для jQuery.' + namePlugin);
        }

    };

})(jQuery);
