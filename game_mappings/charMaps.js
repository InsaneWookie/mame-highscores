/* Character mappings
 *
 * This file holds all available character mappings.
 *
 * A character map, maps hex values to characters.
 * This is done by converting the hex value to decimal and mapping it to the
 * corresponding character in the chosen character map.
 *
 * Do not padd char maps with spaces, use offsets instead.
 *
 * Eg.: The hex value 03 is converted to decimal 3 which woule map to
 *      "D" on the "upper" char map or to "3" on the "numericUpper" char map.
 *
 *      The hex value 0A is converted to decimal 10 which would map to
 *      "K" on the "upper" char map or to "B" on the "numericUpper" char map.
 */
charMaps = {
  "upper": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "numericUpper": "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "numericCharUpper": "0123456789,’.!?- ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "upperNumeric": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
};
