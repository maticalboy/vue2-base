/**
 * element-ui popper bug修复
 * 当页面进行缩放时，下拉框等位置会出现偏差，需要将缩放倍数考虑进去进行计算弹框的位置
 */

import Popper from 'element-ui/lib/utils/popper'
Popper.prototype.modifiers.applyStyle = function (data) {
    // console.log(data.placement);
    // apply the final offsets to the popper
    // NOTE: 1 DOM access here
    var styles = {
        position: data.offsets.popper.position,
        direction: data.placement
    }
    // round top and left to avoid blurry text
    var left = Math.round(data.offsets.popper.left)
    var top = Math.round(data.offsets.popper.top)

    // if gpuAcceleration is set to true and transform is supported, we use `translate3d` to apply the position to the popper
    // we automatically use the supported prefixed version if needed
    var prefixedProperty
    if (
        this._options.gpuAcceleration &&
        (prefixedProperty = getSupportedPropertyName('transform'))
    ) {
        styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)'
        styles.top = 0
        styles.left = 0
    }
    // othwerise, we use the standard `left` and `top` properties
    else {
        //获取当前zoom
        var zoom = window.getComputedStyle(document.body).zoom
        styles.left = left
        styles.top = top
        //当有zoom值时，重新修改样式
        if (zoom !== '1') {
            //其中top-start和top是popper打开的方向，可以通过打印styles.direction来判断这个组件的打开方向
            if (styles.direction === 'top-start') {
                styles.left = left / zoom
                //40或者30是我自己定的，这个方法不能100%还原之前的效果，可以自定义值
                styles.top = top / zoom + 40
            } else if (styles.direction === 'top') {
                styles.left = left / zoom
                styles.top = top / zoom + 30
            } else {
                styles.left = left / zoom
                styles.top = top / zoom
            }
        } else {
            styles.left = left
            styles.top = top
        }
    }

    // any property present in `data.styles` will be applied to the popper,
    // in this way we can make the 3rd party modifiers add custom styles to it
    // Be aware, modifiers could override the properties defined in the previous
    // lines of this modifier!
    Object.assign(styles, data.styles)

    setStyle(this._popper, styles)

    // set an attribute which will be useful to style the tooltip (use it to properly position its arrow)
    // NOTE: 1 DOM access here
    this._popper.setAttribute('x-placement', data.placement)

    // if the arrow modifier is required and the arrow style has been computed, apply the arrow style
    if (
        this.isModifierRequired(this.modifiers.applyStyle, this.modifiers.arrow) &&
        data.offsets.arrow
    ) {
        setStyle(data.arrowElement, data.offsets.arrow)
    }

    return data
}
function setStyle(element, styles) {
    function is_numeric(n) {
        return n !== '' && !isNaN(parseFloat(n)) && isFinite(n)
    }
    Object.keys(styles).forEach(function (prop) {
        var unit = ''
        // add unit if the value is numeric and is one of the following
        if (
            ['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !==
            -1 &&
            is_numeric(styles[prop])
        ) {
            unit = 'px'
        }
        element.style[prop] = styles[prop] + unit
    })
}


