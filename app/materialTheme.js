/**
 * Created by jamesbillinger on 7/20/17.
 */
import { white, darkBlack, fullBlack } from "material-ui/styles/colors";
import { fade } from "material-ui/utils/colorManipulator";
import * as Spacing from "material-ui/styles/spacing";

module.exports = {
  spacing: Spacing,
  fontFamily: 'Roboto, sans-serif',
  fontWeight: '300',
  palette: {
    //old haysmed blue is #0D3561
    //haysmed blue is now #00305C
    //primary1Color: '#9e9e9e',
    primary1Color: '#8BC34A',//'#FF4081',
    primary2Color: '#689F38',
    primary3Color: '#DCEDC8',
    accent1Color: '#795548',//'#00305C',
    accent2Color: '#857e6b',
    accent3Color: '#857e6b',
    textColor: '#212121',
    alternateTextColor: '#757575',
    canvasColor: white,
    borderColor: '#BDBDBD',
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor:'#0D3461',
    clockCircleColor:fade(darkBlack,0.07),
    shadowColor:fullBlack
  }
};