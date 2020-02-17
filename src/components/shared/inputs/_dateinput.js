import { css } from 'react-emotion'

export const dateInputStyles = css({
  '.PresetDateRangePicker_panel': {
    padding: '0 22px 11px',
  },
  '.PresetDateRangePicker_button': {
    height: '100%',
    textAlign: 'center',
    background: '0 0',
    border: '2px solid #00a699',
    color: '#00a699',
    padding: '4px 12px',
    marginRight: '8px',
    font: 'inherit',
    fontWeight: 700,
    lineHeight: 'normal',
    overflow: 'visible',
    mozBoxSizing: 'border-box',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  '.PresetDateRangePicker_button:active': {
    outline: 0,
  },
  '.PresetDateRangePicker_button__selected': {
    color: '#fff',
    background: '#00a699',
  },
  '.SingleDatePickerInput': {
    display: 'inline-block',
    backgroundColor: '#fff',
  },
  '.SingleDatePickerInput__withBorder': {
    borderRadius: '2px',
    border: '1px solid #dbdbdb',
  },
  '.SingleDatePickerInput__rtl': {
    direction: 'rtl',
  },
  '.SingleDatePickerInput__disabled': {
    backgroundColor: '#f2f2f2',
  },
  '.SingleDatePickerInput__block': {
    display: 'block',
  },
  '.SingleDatePickerInput__showClearDate': {
    paddingRight: '30px',
  },
  '.SingleDatePickerInput_clearDate': {
    background: '0 0',
    border: 0,
    color: 'inherit',
    font: 'inherit',
    lineHeight: 'normal',
    overflow: 'visible',
    cursor: 'pointer',
    padding: '10px',
    margin: '0 10px 0 5px',
    position: 'absolute',
    right: 0,
    top: '50%',
    webkitTransform: 'translateY(-50%)',
    msTransform: 'translateY(-50%)',
    transform: 'translateY(-50%)',
  },
  '.SingleDatePickerInput_clearDate__default:hover, .SingleDatePickerInput_clearDate__default:focus': {
    background: '#dbdbdb',
    borderRadius: '50%',
  },
  '.SingleDatePickerInput_clearDate__small': {
    padding: '6px',
  },
  '.SingleDatePickerInput_clearDate__hide': {
    visibility: 'hidden',
  },
  '.SingleDatePickerInput_clearDate_svg': {
    fill: '#82888a',
    height: '12px',
    width: '15px',
    verticalAlign: 'middle',
  },
  '.SingleDatePickerInput_clearDate_svg__small': {
    height: '9px',
  },
  '.SingleDatePickerInput_calendarIcon': {
    background: '0 0',
    border: 0,
    color: 'inherit',
    font: 'inherit',
    lineHeight: 'normal',
    overflow: 'visible',
    cursor: 'pointer',
    display: 'inline-block',
    verticalAlign: 'middle',
    padding: '10px',
    margin: '0 5px 0 10px',
  },
  '.SingleDatePickerInput_calendarIcon_svg': {
    fill: '#82888a',
    height: '15px',
    width: '14px',
    verticalAlign: 'middle',
  },
  '.SingleDatePicker': {
    position: 'relative',
    display: 'inline-block',
  },
  '.SingleDatePicker__block': {
    display: 'block',
  },
  '.SingleDatePicker_picker': {
    zIndex: 1,
    backgroundColor: '#fff',
    position: 'absolute',
  },
  '.SingleDatePicker_picker__rtl': {
    direction: 'rtl',
  },
  '.SingleDatePicker_picker__directionLeft': {
    left: 0,
  },
  '.SingleDatePicker_picker__directionRight': {
    right: 0,
  },
  '.SingleDatePicker_picker__portal': {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },
  '.SingleDatePicker_picker__fullScreenPortal': {
    backgroundColor: '#fff',
  },
  '.SingleDatePicker_closeButton': {
    background: '0 0',
    border: 0,
    color: 'inherit',
    font: 'inherit',
    lineHeight: 'normal',
    overflow: 'visible',
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '15px',
    zIndex: 2,
  },
  '.SingleDatePicker_closeButton:hover, .SingleDatePicker_closeButton:focus': {
    color: 'darken(#cacccd, 10%)',
    textDecoration: 'none',
  },
  '.SingleDatePicker_closeButton_svg': {
    height: '15px',
    width: '15px',
    fill: '#cacccd',
  },
  '.DayPickerKeyboardShortcuts_buttonReset': {
    background: '0 0',
    border: 0,
    borderRadius: 0,
    color: 'inherit',
    font: 'inherit',
    lineHeight: 'normal',
    overflow: 'visible',
    padding: 0,
    cursor: 'pointer',
    fontSize: '14px',
  },
  '.DayPickerKeyboardShortcuts_buttonReset:active': {
    outline: 0,
  },
  '.DayPickerKeyboardShortcuts_show': {
    width: '22px',
    position: 'absolute',
    zIndex: 2,
  },
  '.DayPickerKeyboardShortcuts_show__bottomRight': {
    borderTop: '26px solid transparent',
    borderRight: '33px solid #00a699',
    bottom: 0,
    right: 0,
  },
  '.DayPickerKeyboardShortcuts_show__bottomRight:hover': {
    borderRight: '33px solid #008489',
  },
  '.DayPickerKeyboardShortcuts_show__topRight': {
    borderBottom: '26px solid transparent',
    borderRight: '33px solid #00a699',
    top: 0,
    right: 0,
  },
  '.DayPickerKeyboardShortcuts_show__topRight:hover': {
    borderRight: '33px solid #008489',
  },
  '.DayPickerKeyboardShortcuts_show__topLeft': {
    borderBottom: '26px solid transparent',
    borderLeft: '33px solid #00a699',
    top: 0,
    left: 0,
  },
  '.DayPickerKeyboardShortcuts_show__topLeft:hover': {
    borderLeft: '33px solid #008489',
  },
  '.DayPickerKeyboardShortcuts_showSpan': {
    color: '#fff',
    position: 'absolute',
  },
  '.DayPickerKeyboardShortcuts_showSpan__bottomRight': {
    bottom: 0,
    right: '-28px',
  },
  '.DayPickerKeyboardShortcuts_showSpan__topRight': {
    top: '1px',
    right: '-28px',
  },
  '.DayPickerKeyboardShortcuts_showSpan__topLeft': {
    top: '1px',
    left: '-28px',
  },
  '.DayPickerKeyboardShortcuts_panel': {
    overflow: 'auto',
    background: '#fff',
    border: '1px solid #dbdbdb',
    borderRadius: '2px',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 2,
    padding: '22px',
    margin: '33px',
  },
  '.DayPickerKeyboardShortcuts_title': {
    fontSize: '16px',
    fontWeight: 700,
    margin: 0,
  },
  '.DayPickerKeyboardShortcuts_list': {
    listStyle: 'none',
    padding: 0,
    fontSize: '14px',
  },
  '.DayPickerKeyboardShortcuts_close': {
    position: 'absolute',
    right: '22px',
    top: '22px',
    zIndex: 2,
  },
  '.DayPickerKeyboardShortcuts_close:active': {
    outline: 0,
  },
  '.DayPickerKeyboardShortcuts_closeSvg': {
    height: '15px',
    width: '15px',
    fill: '#cacccd',
  },
  '.DayPickerKeyboardShortcuts_closeSvg:hover, .DayPickerKeyboardShortcuts_closeSvg:focus': {
    fill: '#82888a',
  },
  '.CalendarDay': {
    mozBoxSizing: 'border-box',
    boxSizing: 'border-box',
    cursor: 'pointer',
    fontSize: '14px',
    textAlign: 'center',
  },
  '.CalendarDay:active': {
    outline: 0,
  },
  '.CalendarDay__defaultCursor': {
    cursor: 'default',
  },
  '.CalendarDay__default': {
    border: '1px solid #e4e7e7',
    color: '#484848',
    background: '#fff',
  },
  '.CalendarDay__default:hover': {
    background: '#e4e7e7',
    border: '1px solid #e4e7e7',
    color: 'inherit',
  },
  '.CalendarDay__hovered_offset': {
    background: '#f4f5f5',
    border: '1px double #e4e7e7',
    color: 'inherit',
  },
  '.CalendarDay__outside': {
    border: 0,
    background: '#fff',
    color: '#484848',
  },
  '.CalendarDay__outside:hover': {
    border: 0,
  },
  '.CalendarDay__blocked_minimum_nights': {
    background: '#fff',
    border: '1px solid #eceeee',
    color: '#cacccd',
  },
  '.CalendarDay__blocked_minimum_nights:hover, .CalendarDay__blocked_minimum_nights:active': {
    background: '#fff',
    color: '#cacccd',
  },
  '.CalendarDay__highlighted_calendar': {
    background: '#ffe8bc',
    color: '#484848',
  },
  '.CalendarDay__highlighted_calendar:hover, .CalendarDay__highlighted_calendar:active': {
    background: '#ffce71',
    color: '#484848',
  },
  '.CalendarDay__selected_span': {
    background: '#66e2da',
    border: '1px double #33dacd',
    color: '#fff',
  },
  '.CalendarDay__selected_span:hover, .CalendarDay__selected_span:active': {
    background: '#33dacd',
    border: '1px double #33dacd',
    color: '#fff',
  },
  '.CalendarDay__last_in_range, .CalendarDay__last_in_range:hover': {
    borderStyle: 'solid',
  },
  '.CalendarDay__selected, .CalendarDay__selected:active, .CalendarDay__selected:hover': {
    background: '#00a699',
    border: '1px double #00a699',
    color: '#fff',
  },
  '.CalendarDay__hovered_span, .CalendarDay__hovered_span:hover': {
    background: '#b2f1ec',
    border: '1px double #80e8e0',
    color: '#007a87',
  },
  '.CalendarDay__hovered_span:active': {
    background: '#80e8e0',
    border: '1px double #80e8e0',
    color: '#007a87',
  },
  '.CalendarDay__blocked_calendar, .CalendarDay__blocked_calendar:active, .CalendarDay__blocked_calendar:hover': {
    background: '#cacccd',
    border: '1px solid #cacccd',
    color: '#82888a',
  },
  '.CalendarDay__blocked_out_of_range, .CalendarDay__blocked_out_of_range:active, .CalendarDay__blocked_out_of_range:hover': {
    background: '#fff',
    border: '1px solid #e4e7e7',
    color: '#cacccd',
  },
  '.CalendarMonth': {
    background: '#fff',
    textAlign: 'center',
    verticalAlign: 'top',
    webkitUserSelect: 'none',
    mozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  },
  '.CalendarMonth_table': {
    borderCollapse: 'collapse',
    borderSpacing: 0,
  },
  '.CalendarMonth_verticalSpacing': {
    borderCollapse: 'separate',
  },
  '.CalendarMonth_caption': {
    color: '#484848',
    fontSize: '18px',
    textAlign: 'center',
    paddingTop: '22px',
    paddingBottom: '37px',
    captionSide: 'initial',
  },
  '.CalendarMonth_caption__verticalScrollable': {
    paddingTop: '12px',
    paddingBottom: '7px',
  },
  '.CalendarMonthGrid': {
    background: '#fff',
    textAlign: 'left',
    zIndex: 0,
  },
  '.CalendarMonthGrid__animating': {
    zIndex: 1,
  },
  '.CalendarMonthGrid__horizontal': {
    position: 'absolute',
    left: '9px',
  },
  '.CalendarMonthGrid__vertical': {
    margin: '0 auto',
  },
  '.CalendarMonthGrid__vertical_scrollable': {
    margin: '0 auto',
    overflowY: 'scroll',
  },
  '.CalendarMonthGrid_month__horizontal': {
    display: 'inline-block',
    verticalAlign: 'top',
    minHeight: '100%',
  },
  '.CalendarMonthGrid_month__hideForAnimation': {
    position: 'absolute',
    zIndex: -1,
    opacity: 0,
    pointerEvents: 'none',
  },
  '.CalendarMonthGrid_month__hidden': {
    visibility: 'hidden',
  },
  '.DayPickerNavigation': {
    position: 'relative',
    zIndex: 2,
  },
  '.DayPickerNavigation__horizontal': {
    height: 0,
  },
  '.DayPickerNavigation__verticalDefault': {
    position: 'absolute',
    width: '100%',
    height: '52px',
    bottom: 0,
    left: 0,
  },
  '.DayPickerNavigation__verticalScrollableDefault': {
    position: 'relative',
  },
  '.DayPickerNavigation_button': {
    cursor: 'pointer',
    webkitUsersSelect: 'none',
    mozUsersSelect: 'none',
    msUsersSelect: 'none',
    usersSelect: 'none',
    border: 0,
    padding: 0,
    margin: 0,
  },
  '.DayPickerNavigation_button__default': {
    border: '1px solid #e4e7e7',
    backgroundColor: '#fff',
    color: '#757575',
  },
  '.DayPickerNavigation_button__default:hover, .DayPickerNavigation_button__default:focus': {
    border: '1px solid #c4c4c4',
  },
  '.DayPickerNavigation_button__default:active': {
    background: '#f2f2f2',
  },
  '.DayPickerNavigation_button__horizontalDefault': {
    position: 'absolute',
    top: '18px',
    lineHeight: 0.78,
    borderRadius: '3px',
    padding: '6px 9px',
  },
  '.DayPickerNavigation_leftButton__horizontalDefault': {
    left: '22px',
  },
  '.DayPickerNavigation_rightButton__horizontalDefault': {
    right: '22px',
  },
  '.DayPickerNavigation_button__verticalDefault': {
    padding: '5px',
    background: '#fff',
    boxShadow: '0 0 5px 2px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    display: 'nline-block',
    textAlign: 'center',
    height: '100%',
    width: '50%',
  },
  '.DayPickerNavigation_nextButton__verticalDefault': {
    borderLeft: 0,
  },
  '.DayPickerNavigation_nextButton__verticalScrollableDefault': {
    width: '100%',
  },
  '.DayPickerNavigation_svg__horizontal': {
    height: '19px',
    width: '19px',
    fill: '#82888a',
    display: 'block',
  },
  '.DayPickerNavigation_svg__vertical': {
    height: '42px',
    width: '42px',
    fill: '#484848',
  },
  '.DayPicker': {
    background: '#fff',
    position: 'relative',
    textAlign: 'left',
  },
  '.DayPicker__horizontal': {
    background: '#fff',
  },
  '.DayPicker__verticalScrollable': {
    height: '100%',
  },
  '.DayPicker__hidden': {
    visibility: 'hidden',
  },
  '.DayPicker__withBorder': {
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.07)',
    borderRadius: '3px',
  },
  '.DayPicker_portal__horizontal': {
    boxShadow: 'none',
    position: 'absolute',
    left: '50%',
    top: '50%',
  },
  '.DayPicker_portal__vertical': {
    position: 'initial',
  },
  '.DayPicker_focusRegion': {
    outline: 0,
  },
  '.DayPicker_calendarInfo__horizontal, .DayPicker_wrapper__horizontal': {
    display: 'inline-block',
    verticalAlign: 'top',
  },
  '.DayPicker_weekHeaders': {
    position: 'relative',
  },
  '.DayPicker_weekHeaders__horizontal': {
    marginLeft: '9px',
  },
  '.DayPicker_weekHeader': {
    color: '#757575',
    position: 'absolute',
    top: '62px',
    zIndex: 2,
    textAlign: 'left',
  },
  '.DayPicker_weekHeader__vertical': {
    left: '50%',
  },
  '.DayPicker_weekHeader__verticalScrollable': {
    top: 0,
    display: 'table-row',
    borderBottom: '1px solid #dbdbdb',
    background: '#fff',
    marginLeft: 0,
    left: 0,
    width: '100%',
    textAlign: 'center',
  },
  '.DayPicker_weekHeader_ul': {
    listStyle: 'none',
    margin: '1px 0',
    paddingLeft: 0,
    paddingRight: 0,
    fontSize: '14px',
  },
  '.DayPicker_weekHeader_li': {
    display: 'inline-block',
    textAlign: 'center',
  },
  '.DayPicker_transitionContainer': {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '3px',
  },
  '.DayPicker_transitionContainer__horizontal': {
    webkitTransition: 'height 0.2s ease-in-out',
    mozTransition: 'height 0.2s ease-in-out',
    transition: 'height 0.2s ease-in-out',
  },
  '.DayPicker_transitionContainer__vertical': {
    width: '100%',
  },
  '.DayPicker_transitionContainer__verticalScrollable': {
    paddingTop: '20px',
    height: '100%',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    overflowY: 'scroll',
  },
  '.DateInput': {
    margin: 0,
    padding: 0,
    background: '#fff',
    position: 'relative',
    display: 'inline-block',
    width: '130px',
    verticalAlign: 'middle',
  },
  '.DateInput__small': {
    width: '97px',
  },
  '.DateInput__block': {
    width: '100%',
  },
  '.DateInput__disabled': {
    background: '#f2f2f2',
    color: '#dbdbdb',
  },
  '.DateInput_input': {
    fontWeight: 200,
    fontSize: '19px',
    lineHeight: '24px',
    color: '#484848',
    backgroundColor: '#fff',
    width: '100%',
    padding: '11px 11px 9px',
    border: 0,
    borderTop: 0,
    borderRight: 0,
    borderBottom: '2px solid transparent',
    borderLeft: 0,
    borderRadius: 0,
  },
  '.DateInput_input__small': {
    fontSize: '15px',
    lineHeight: '18px',
    letterSpacing: '0.2px',
    padding: '7px 7px 5px',
  },
  '.DateInput_input__regular': {
    fontWeight: 'auto',
  },
  '.DateInput_input__readOnly': {
    webkitUserSelect: 'none',
    mozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  },
  '.DateInput_input__focused': {
    outline: 0,
    background: '#fff',
    border: 0,
    borderTop: 0,
    borderRight: 0,
    borderBottom: '2px solid #008489',
    borderLeft: 0,
  },
  '.DateInput_input__disabled': {
    background: '#f2f2f2',
    fontStyle: 'italic',
  },
  '.DateInput_screenReaderMessage': {
    border: 0,
    clip: 'rect(0, 0, 0, 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    width: '1px',
  },
  '.DateInput_fang': {
    position: 'absolute',
    width: '20px',
    height: '10px',
    left: '22px',
    zIndex: 2,
  },
  '.DateInput_fangShape': {
    fill: '#fff',
  },
  '.DateInput_fangStroke': {
    stroke: '#dbdbdb',
    fill: 'transparent',
  },

  '.DateRangePickerInput': {
    backgroundColor: '#fff',
    display: 'inline-block',
  },
  '.DateRangePickerInput__disabled': {
    background: '#f2f2f2',
  },
  '.DateRangePickerInput__withBorder': {
    borderRadius: '2px',
    border: '1px solid #dbdbdb',
  },
  '.DateRangePickerInput__rtl': {
    direction: 'rtl',
  },
  '.DateRangePickerInput__block': {
    display: 'block',
  },
  '.DateRangePickerInput__showClearDates': {
    paddingRight: '30px',
  },
  '.DateRangePickerInput_arrow': {
    display: 'inline-block',
    verticalAlign: 'middle',
    color: '#484848',
  },
  '.DateRangePickerInput_arrow_svg': {
    verticalAlign: 'middle',
    fill: '#484848',
    height: '24px',
    width: '24px',
  },
  '.DateRangePickerInput_clearDates': {
    background: '0 0',
    border: 0,
    color: 'inherit',
    font: 'inherit',
    lineHeight: 'normal',
    overflow: 'visible',
    cursor: 'pointer',
    padding: '10px',
    margin: '0 10px 0 5px',
    position: 'absolute',
    right: 0,
    top: '50%',
    webkitTransform: 'translateY(-50%)',
    msTransform: 'translateY(-50%)',
    transform: 'translateY(-50%)',
  },
  '.DateRangePickerInput_clearDates__small': {
    padding: '6px',
  },
  '.DateRangePickerInput_clearDates_default:hover, .DateRangePickerInput_clearDates_default:focus': {
    background: '#dbdbdb',
    borderRadius: '50%',
  },
  '.DateRangePickerInput_clearDates__hide': {
    visibility: 'hidden',
  },
  '.DateRangePickerInput_clearDates_svg': {
    fill: '#82888a',
    height: '12px',
    width: '15px',
    verticalAlign: 'middle',
  },
  '.DateRangePickerInput_clearDates_svg__small': {
    height: '9px',
  },
  '.DateRangePickerInput_calendarIcon': {
    background: '0 0',
    border: 0,
    color: 'inherit',
    font: 'inherit',
    lineHeight: 'normal',
    overflow: 'visible',
    cursor: 'pointer',
    display: 'inline-block',
    verticalAlign: 'middle',
    padding: '10px',
    margin: '0 5px 0 10px',
  },
  '.DateRangePickerInput_calendarIcon_svg': {
    fill: '#82888a',
    height: '15px',
    width: '14px',
    verticalAlign: 'middle',
  },
  '.DateRangePicker': {
    position: 'relative',
    display: 'inline-block',
  },
  '.DateRangePicker__block': {
    display: 'block',
  },
  '.DateRangePicker_picker': {
    zIndex: 1,
    backgroundColor: '#fff',
    position: 'absolute',
  },
  '.DateRangePicker_picker__rtl': {
    direction: 'rtl',
  },
  '.DateRangePicker_picker__directionLeft': {
    left: 0,
  },
  '.DateRangePicker_picker__directionRight': {
    right: 0,
  },
  '.DateRangePicker_picker__portal': {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },
  '.DateRangePicker_picker__fullScreenPortal': {
    backgroundColor: '#fff',
  },
  '.DateRangePicker_closeButton': {
    background: '0 0',
    border: 0,
    color: 'inherit',
    font: 'inherit',
    lineHeight: 'normal',
    overflow: 'visible',
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '15px',
    zIndex: 2,
  },
  '.DateRangePicker_closeButton:hover, .DateRangePicker_closeButton:focus': {
    color: 'darken(#cacccd, 10%)',
    textDecoration: 'none',
  },
  '.DateRangePicker_closeButton_svg': {
    height: '15px',
    width: '15px',
    fill: '#cacccd',
  },
})
