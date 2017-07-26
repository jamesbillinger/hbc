/**
 * Created by jamesbillinger on 4/18/17.
 */
import React, { Component } from 'react';
import TextField from "material-ui/TextField";
import InputMask from 'inputmask-core'

var KEYCODE_Z = 90
var KEYCODE_Y = 89

function isUndo(e) {
  return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYCODE_Y : KEYCODE_Z)
}

function isRedo(e) {
  return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYCODE_Z : KEYCODE_Y)
}

function getSelection (el) {
  let start, end, rangeEl, clone

  if (el.selectionStart !== undefined) {
    start = el.selectionStart
    end = el.selectionEnd
  }
  else {
    try {
      el.focus()
      rangeEl = el.createTextRange()
      clone = rangeEl.duplicate()

      rangeEl.moveToBookmark(document.selection.createRange().getBookmark())
      clone.setEndPoint('EndToStart', rangeEl)

      start = clone.text.length
      end = start + rangeEl.text.length
    }
    catch (e) { /* not focused or not visible */ }
  }

  return { start, end }
}

function setSelection(el, selection) {
  let rangeEl

  try {
    if (el.selectionStart !== undefined) {
      el.focus()
      el.setSelectionRange(selection.start, selection.end)
    }
    else {
      el.focus()
      rangeEl = el.createTextRange()
      rangeEl.collapse(true)
      rangeEl.moveStart('character', selection.start)
      rangeEl.moveEnd('character', selection.end - selection.start)
      rangeEl.select()
    }
  }
  catch (e) { /* not focused or not visible */ }
}

export default class MaskedInput extends Component {
  componentWillMount() {
    let options = {
      pattern: this.props.mask,
      value: this.props.input.value,
      formatCharacters: this.props.formatCharacters
    };
    if (this.props.placeholderChar) {
      options.placeholderChar = this.props.placeholderChar
    }
    this.mask = new InputMask(options);
    this._onChange = ::this.onChange;
    this._onKeyDown = ::this.onKeyDown;
    this._onPaste = ::this.onPaste;
    this._onKeyPress = ::this.onKeyPress;
  }
  
  componentDidMount() {
    const { autoFocus } = this.props;
    if (autoFocus) {
      this._field && this._field.focus();
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (this.props.mask !== nextProps.mask && this.props.input.value !== nextProps.mask) {
      // if we get a new value and a new mask at the same time
      // check if the mask.value is still the initial value
      // - if so use the nextProps value
      // - otherwise the `this.mask` has a value for us (most likely from paste action)
      if (this.mask.getValue() === this.mask.emptyValue) {
        this.mask.setPattern(nextProps.mask, {value: nextProps.input.value})
      }
      else {
        this.mask.setPattern(nextProps.mask, {value: this.mask.getRawValue()})
      }
    }
    else if (this.props.mask !== nextProps.mask) {
      this.mask.setPattern(nextProps.mask, {value: this.mask.getRawValue()})
    }
    else if (this.props.input.value !== nextProps.input.value) {
      this.mask.setValue(nextProps.input.value)
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.mask !== this.props.mask) {
      this.updatePattern(nextProps)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.mask !== this.props.mask && this.mask.selection.start) {
      this.updateInputSelection()
    }
  }

  updatePattern(props) {
    this.mask.setPattern(props.mask, {
      value: this.mask.getRawValue(),
      selection: getSelection(this._field.input)
    })
  }

  updateMaskSelection() {
    this.mask.selection = getSelection(this._field.input)
  }

  updateInputSelection() {
    setSelection(this._field.input, this.mask.selection)
  }

  onChange(e) {
    // console.log('onChange', JSON.stringify(getSelection(this._field.input)), e.target.value)
    let maskValue = this.mask.getValue()
    if (e.target.value !== maskValue) {
      // Cut or delete operations will have shortened the value
      if (e.target.value.length < maskValue.length) {
        let sizeDiff = maskValue.length - e.target.value.length
        this.updateMaskSelection()
        this.mask.selection.end = this.mask.selection.start + sizeDiff
        this.mask.backspace()
      }
      let value = this.getDisplayValue()
      e.target.value = value
      if (value) {
        this.updateInputSelection()
      }
    }
    if (this.props.input.onChange) {
      this.props.input.onChange(e);
    }
  }

  onKeyDown(e) {
    if (isUndo(e)) {
      e.preventDefault()
      if (this.mask.undo()) {
        e.target.value = this.getDisplayValue()
        this.updateInputSelection()
        if (this.props.input.onChange) {
          this.props.input.onChange(e)
        }
      }
      return
    }
    else if (isRedo(e)) {
      e.preventDefault()
      if (this.mask.redo()) {
        e.target.value = this.getDisplayValue()
        this.updateInputSelection()
        if (this.props.input.onChange) {
          this.props.input.onChange(e)
        }
      }
      return
    }

    if (e.key === 'Backspace') {
      e.preventDefault()
      this.updateMaskSelection()
      if (this.mask.backspace()) {
        let value = this.getDisplayValue()
        e.target.value = value
        if (value) {
          this.updateInputSelection()
        }
        if (this.props.input.onChange) {
          this.props.input.onChange(e)
        }
      }
    }
  }

  onKeyPress(e) {
    // console.log('onKeyPress', JSON.stringify(getSelection(this._field.input)), e.key, e.target.value)

    // Ignore modified key presses
    // Ignore enter key to allow form submission
    if (e.metaKey || e.altKey || e.ctrlKey || e.key === 'Enter') { return }

    e.preventDefault()
    this.updateMaskSelection()
    if (this.mask.input((e.key || e.data))) {
      e.target.value = this.mask.getValue()
      this.updateInputSelection()
      if (this.props.input.onChange) {
        this.props.input.onChange(e)
      }
    }
  }

  onPaste(e) {
    // console.log('onPaste', JSON.stringify(getSelection(this._field.input)), e.clipboardData.getData('Text'), e.target.value)

    e.preventDefault()
    this.updateMaskSelection()
    // getData value needed for IE also works in FF & Chrome
    if (this.mask.paste(e.clipboardData.getData('Text'))) {
      e.target.value = this.mask.getValue()
      // Timeout needed for IE
      setTimeout(this.updateInputSelection, 0)
      if (this.props.input.onChange) {
        this.props.input.onChange(e)
      }
    }
  }

  getDisplayValue() {
    let value = this.mask.getValue()
    return value === this.mask.emptyValue ? '' : value
  }

  keyPressPropName() {
    if (typeof navigator !== 'undefined') {
      return navigator.userAgent.match(/Android/i)
        ? 'onBeforeInput'
        : 'onKeyPress'
    }
    return 'onKeyPress'
  }

  getEventHandlers() {
    return {
      onChange: this._onChange,
      onKeyDown: this._onKeyDown,
      onPaste: this._onPaste,
      [this.keyPressPropName()]: this._onKeyPress
    }
  }
  
  focus() {
    this._field && this._field.focus();
  }
  
  blur() {
    this._field && this._field.blur();
  }

  render() {
    const {style, type, input, meta, label, ...props} = this.props;
    const { onChange, onBlur, onFocus } = input || props;
    const { error, touched } = meta || props;
    let newStyle = Object.assign({
      margin:'0px 10px',
      verticalAlign:'top',
      fontWeight:'normal',
      display:'block'
    }, style);
    if (props.disabled) {
      newStyle.color = 'rgba(0,0,0,0.3)';
    }
    if (props.multiLine) {
      newStyle.width = '80%';
    }

    let maxLength = this.mask.pattern.length;
    let value = this.getDisplayValue();
    let eventHandlers = this.getEventHandlers();
    let { size = maxLength, placeholder = this.mask.emptyValue } = this.props;

    //let { placeholderChar, formatCharacters, ...cleanedProps } = this.props;
    let inputProps = { ...eventHandlers, maxLength, value, size, placeholder };

    return (
      <TextField ref={(c) => this._field = c} id='unique' style={newStyle} value={value || ''}
                 floatingLabelStyle={{pointerEvents: 'none', whiteSpace:'nowrap', left:'0px', color:'rgba(33, 33, 33, 0.5)'}}
                 type={type} floatingLabelText={label} errorText={(touched && error) ? error : null}
                 onBlur={onBlur} onFocus={onFocus} floatingLabelFixed={true} {...inputProps} />
    );
  }
}