import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from 'material-ui/SvgIcon/SvgIcon';
import MANIFEST from '../manifest'

const MOVE = MANIFEST.CONSTS.MOVE;

export const RockIcon = props => (
  <SvgIcon viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet"
    {...props} >
    <g transform="translate(0,120) scale(0.1,-0.1)">
      <path d="M338 1107 c-34 -27 -56 -78 -64 -151 -6 -52 -5 -56 14 -56 55 0 92
-43 92 -106 0 -21 5 -24 35 -24 22 0 43 8 55 20 18 18 20 33 20 164 0 79 -3
151 -6 160 -10 26 -112 22 -146 -7z"/>
<path d="M553 1120 c-37 -16 -43 -42 -43 -202 0 -120 3 -158 15 -175 21 -29
82 -39 129 -19 l36 15 0 179 c0 147 -3 182 -15 192 -19 16 -94 22 -122 10z"/>
<path d="M765 1043 c-44 -11 -45 -18 -45 -204 0 -204 -2 -199 89 -199 77 0 81
11 81 206 0 141 -2 163 -17 177 -20 17 -77 28 -108 20z"/>
<path d="M943 925 c-22 -16 -23 -21 -23 -190 0 -168 1 -174 22 -189 12 -9 41
-16 64 -16 34 0 47 5 63 26 19 24 21 40 21 183 0 115 -4 162 -13 175 -19 26
-104 33 -134 11z"/>
<path d="M215 840 c-16 -11 -51 -40 -77 -66 -47 -47 -48 -48 -48 -112 0 -56 5
-72 37 -126 61 -103 137 -208 276 -384 5 -7 10 -26 9 -42 l-1 -30 297 0 298 0
13 48 c8 26 22 65 31 87 31 69 51 144 57 211 5 54 3 64 -10 64 -9 0 -18 -4
-21 -9 -11 -16 -84 -23 -121 -11 -41 14 -65 44 -65 82 l0 27 -69 -6 c-68 -6
-71 -5 -100 25 -17 17 -31 38 -31 47 0 13 -7 15 -37 9 -21 -3 -40 -6 -43 -6
-51 0 -66 6 -95 36 -31 33 -34 34 -86 28 l-54 -7 -6 -53 c-7 -55 -22 -82 -45
-82 -19 0 -18 9 6 55 26 50 28 179 4 213 -20 28 -77 30 -119 2z"/>
</g>
  </SvgIcon>
);


export const PaperIcon = props => (
  <SvgIcon viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet"
    {...props} >
    <g transform="translate(0,120) scale(0.1,-0.1)">
      <path d="M580 1130 c-19 -19 -20 -33 -20 -236 0 -168 -3 -215 -12 -212 -10 4
-14 53 -18 183 l-5 179 -27 15 c-20 12 -34 13 -55 6 -49 -18 -53 -39 -53 -305
l-1 -245 -22 30 c-51 69 -84 95 -121 95 -69 0 -98 -69 -59 -143 38 -74 213
-325 249 -356 50 -44 104 -67 189 -81 137 -22 265 11 333 84 68 74 72 101 72
477 0 366 1 359 -69 359 -61 0 -66 -13 -63 -166 2 -74 1 -143 -3 -154 -17 -54
-24 -2 -27 194 -3 194 -5 216 -22 235 -23 26 -66 27 -95 4 -20 -17 -21 -28
-23 -212 -2 -145 -6 -195 -15 -199 -10 -3 -13 44 -13 212 0 203 -1 217 -20
236 -11 11 -33 20 -50 20 -17 0 -39 -9 -50 -20z"/>
</g>
  </SvgIcon>
);


export const ScissorsIcon = props => (
  <SvgIcon viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet"
    {...props} >
    <g transform="translate(0,120) scale(0.1,-0.1)">
      <path d="M597 1182 c-15 -16 -17 -49 -18 -238 l-1 -219 -42 196 c-23 108 -48
   204 -55 213 -19 23 -74 20 -96 -4 -17 -19 -17 -30 17 -327 20 -170 34 -310 32
   -312 -11 -12 -72 30 -118 80 -48 53 -57 59 -92 59 -50 0 -64 -14 -64 -62 0
   -50 11 -71 137 -261 l105 -157 271 2 270 3 33 59 c39 70 43 97 46 290 2 147 1
   149 -22 168 -18 15 -34 19 -63 15 -23 -3 -49 1 -68 10 -18 9 -48 13 -77 11
   l-47 -3 -20 231 c-14 155 -25 237 -34 248 -18 22 -74 21 -94 -2z"/>
   <path d="M412 68 l3 -53 252 -3 c246 -2 252 -2 263 18 6 12 10 35 8 53 l-3 32
   -263 3 -263 2 3 -52z"/>
   </g>
  </SvgIcon>
);

const iconMap = {
  [MOVE.SCISSORS]: ScissorsIcon,
  [MOVE.ROCK]: RockIcon,
  [MOVE.PAPER]: PaperIcon
}


export class RSPMoveIcon extends React.Component {

  render() {
    var IconElement = iconMap[this.props.move];
    if (IconElement)
      return <IconElement {...this.props} />
    else
      return null;
  }
}


RSPMoveIcon.propTypes = {
  move: PropTypes.string.isRequired
};
