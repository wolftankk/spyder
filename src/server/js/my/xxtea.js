/* xxtea.js
*
* Author: Ma Bingyao <andot@ujn.edu.cn>
* Copyright: CoolCode.CN
* Version: 1.4
* LastModified: 2006-07-23
* This library is free. You can redistribute it and/or modify it.
* http://www.coolcode.cn/?p=128
*/
 
function Array2str(v, w) {
    var len = v.length;
    var n = int32(len << 2);
    var str='';
    if (w) {
        var m = v[len - 1];
        if (m > n) { return ''; }
        else { n = m; }

    }
    for (var i = 0; i < n; i++) {
        str += String(int32(v[i >> 2] >> ((i & 3) << 3)) & 0xFF);            
    }
    return str;
}

function long2str(v, w) {
    var len = v.length;
    var str = [];
    for (var i = 0; i < len; ++i) {
        str[i] = pack("V", v[i]);
    }
    if (w) { return v.join('').substring(0, n); }
    else { return v.join(''); }
}
 
function str2long(s, w) {    
    var len = s.length;
    var v = []; 
    for (var i = 0; i < len; i += 4) {        
        v[i >> 2] = s.charCodeAt(i) | s.charCodeAt(i + 1) << 8 | s.charCodeAt(i + 2) << 16 | s.charCodeAt(i + 3) << 24; 
    }
    if (w) {
        v[v.length] = len;
    }    
    return v;
}
 
function xxtea_encrypt(str) {
 if (str == "") {
 return "";
 }
 var v = str2long(str, true);
 var k = str2long('Password Key Of MingYi System ', false);
 if (k.length < 4) {
     for (i = 0; i < 4; i++) { k[i] = 0; }
 }
 var n = v.length - 1;
 
 var z = v[n], y = v[0], delta = 0x9E3779B9;
 var mx, e, q = Math.floor(6 + 52 / (n + 1)), sum = 0;
 while (0 < q--) {
    sum = int32(sum + delta);   
    e = sum >> 2 & 3;
    for (var p = 0; p < n; p++) {
        y = v[p + 1];
        mx = int32(int32(((z >> 5 & 0x07FFFFFF) ^ (y << 2)) + ((y >> 3 & 0x1FFFFFFF) ^ (z << 4))) ^ int32((sum ^ y) + (k[p & 3 ^ e] ^ z)));
        z = v[p] = int32(v[p] + mx);
    }
    y = v[0];
    mx = int32(int32(((z >> 5 & 0x07FFFFFF) ^ (y << 2)) + ((y >> 3 & 0x1FFFFFFF) ^ (z << 4))) ^ int32((sum ^ y) + (k[p & 3 ^ e] ^ z)));
    z = v[p] = int32(v[p] + mx);
} 
 return Array2str(v,false);
}

function int32(v) {
        while (v >= 4294967296) { v -= 4294967296; }
        while (v < 0) { v = v >>> 0; }
        return Number(v);
}


function pack(format) {
    // Takes one or more arguments and packs them into a binary string according to the format argument  
    // 
    // version: 1006.1915
    // discuss at: http://phpjs.org/functions/pack    // +   original by: Tim de Koning (http://www.kingsquare.nl)
    // +      parts by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // +   bugfixed by: Tim de Koning (http://www.kingsquare.nl)
    // %        note 1: Float encoding by: Jonas Raoni Soares Silva
    // %        note 2: Home: http://www.kingsquare.nl/blog/12-12-2009/13507444    // %        note 3: Feedback: phpjs-pack@kingsquare.nl
    // %        note 4: 'machine dependent byte order and size' aren't
    // %        note 4: applicable for JavaScript; pack works as on a 32bit,
    // %        note 4: little endian machine
    // *     example 1: pack('nvc*', 0x1234, 0x5678, 65, 66);    // *     returns 1: '4xVAB'
    var formatPointer = 0,
        argumentPointer = 1,
        result = '',
        argument = '',i = 0,
        r = [],
        instruction, quantifier, word, precisionBits,
        exponentBits, extraNullCount;
     // vars used by float encoding
    var bias, minExp, maxExp, minUnnormExp, status, exp, len, bin,
        signal, n, intPart, floatPart, lastBit, rounded, j, k, tmpResult;
 
    while (formatPointer < format.length) {        
        instruction = format[formatPointer];
        quantifier = '';
        formatPointer++;
        while ((formatPointer < format.length) &&
              (format[formatPointer].match(/[\d\*]/) !== null)) {            
            quantifier += format[formatPointer];
            formatPointer++;
        }
        if (quantifier === '') {
            quantifier = '1';        
        }
 
        // Now pack variables: 'quantifier' times 'instruction'
        switch (instruction) {
        case 'a': // NUL-padded string        
        case 'A': // SPACE-padded string 
            if (typeof arguments[argumentPointer] === 'undefined') {
                throw new Error('Warning:  pack() Type ' + instruction +
                       ': not enough arguments');
                } else {
                argument = String(arguments[argumentPointer]);
            }
            if (quantifier === '*') {
                quantifier = argument.length;            
            }
            for (i = 0; i < quantifier; i ++) {
                if (typeof argument[i] === 'undefined') {
                    if (instruction === 'a') {
                        result += String.fromCharCode(0);                    
                    } else {
                        result += ' ';
                    }
                } else {
                    result += argument[i];                
                }
            }
            argumentPointer++;
            break;
        case 'h': // Hex string, low nibble first        
        case 'H': // Hex string, high nibble first
            if (typeof arguments[argumentPointer] === 'undefined') {
                throw new Error('Warning: pack() Type ' + instruction +': not enough arguments');
            } else {                
                argument = arguments[argumentPointer];
            }
            if (quantifier === '*') {
                quantifier = argument.length;
            }            
            if (quantifier > argument.length) {
                throw new Error('Warning: pack() Type ' + instruction +': not enough characters in string');
            }
            for (i = 0; i < quantifier; i += 2) {                // Always get per 2 bytes...
                word = argument[i];
                if (((i + 1) >= quantifier) || typeof(argument[i + 1]) === 'undefined') {
                    word += '0';                
                } else {
                    word += argument[i + 1];
                }
                // The fastest way to reverse?
                if (instruction === 'h') {                    
                    word = word[1] + word[0];
                }
                result += String.fromCharCode(parseInt(word, 16));
            }
            argumentPointer++;            
            break;
 
        case 'c': // signed char
        case 'C': // unsigned char
            // c and C is the same in pack            
            if (quantifier === '*') {
                quantifier = arguments.length - argumentPointer;
            }
            if (quantifier > (arguments.length - argumentPointer)) {
                throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
            }
 
            for (i = 0; i < quantifier; i++) {
                result += String.fromCharCode(arguments[argumentPointer]);                
                argumentPointer++;
            }
            break;

        case 's': // signed short (always 16 bit, machine byte order)        
        case 'S': // unsigned short (always 16 bit, machine byte order)
        case 'v': // s and S is the same in pack
            if (quantifier === '*') {
                quantifier = arguments.length - argumentPointer;            
            }
            if (quantifier > (arguments.length - argumentPointer)) {
                throw new Error('Warning:  pack() Type ' + instruction +': too few arguments');
            } 
            for (i = 0; i < quantifier; i++) {
                result += String.fromCharCode(arguments[argumentPointer] & 0xFF);
                result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF);
                argumentPointer++;
            }
            break;
         case 'n': // unsigned short (always 16 bit, big endian byte order)
            if (quantifier === '*') {
                quantifier = arguments.length - argumentPointer;
            }
            if (quantifier > (arguments.length - argumentPointer)) {                
                throw new Error('Warning:  pack() Type ' + instruction +': too few arguments');
            }
 
            for (i = 0; i < quantifier; i++) {                
                result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF);
                result += String.fromCharCode(arguments[argumentPointer] & 0xFF);
                argumentPointer++;            
            }
            break;
 
        case 'i': // signed integer (machine dependent size and byte order)
        case 'I': // unsigned integer (machine dependent size and byte order)        
        case 'l': // signed long (always 32 bit, machine byte order)
        case 'L': // unsigned long (always 32 bit, machine byte order)
        case 'V': // unsigned long (always 32 bit, little endian byte order)
            if (quantifier === '*') {
                quantifier = arguments.length - argumentPointer;            
            }
            if (quantifier > (arguments.length - argumentPointer)) {
                throw new Error('Warning:  pack() Type ' + instruction +': too few arguments');
            } 
            for (i = 0; i < quantifier; i++) {
                result += String.fromCharCode(arguments[argumentPointer] & 0xFF);
                result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF);
                result += String.fromCharCode(arguments[argumentPointer] >> 16 & 0xFF);
                result += String.fromCharCode(arguments[argumentPointer] >> 24 & 0xFF);                
                argumentPointer++;
            }
 
            break;
        case 'N': // unsigned long (always 32 bit, big endian byte order)            
            if (quantifier === '*') {
                quantifier = arguments.length - argumentPointer;
            }
            if (quantifier > (arguments.length - argumentPointer)) {
                throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
            }
 
            for (i = 0; i < quantifier; i++) {
                result += String.fromCharCode(arguments[argumentPointer] >> 24 & 0xFF);
                result += String.fromCharCode(arguments[argumentPointer] >> 16 & 0xFF);
                result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF);                
                result += String.fromCharCode(arguments[argumentPointer] & 0xFF);
                argumentPointer++;
            }
            break; 
        case 'f': // float (machine dependent size and representation)
        case 'd': // double (machine dependent size and representation)
            // version based on IEEE754
             precisionBits = 23;
            exponentBits = 8;
            if (instruction === 'd') {
                precisionBits = 52;
                exponentBits = 11;            
            }
 
            if (quantifier === '*') {
                quantifier = arguments.length - argumentPointer;
            }            
            if (quantifier > (arguments.length - argumentPointer)) {
                throw new Error('Warning:  pack() Type ' + instruction +': too few arguments');
            }
            for (i = 0; i < quantifier; i++) {                
                argument = arguments[argumentPointer];
                bias = Math.pow(2, exponentBits - 1) - 1;
                minExp = -bias + 1;
                maxExp = bias;
                minUnnormExp = minExp - precisionBits;                
                status = isNaN(n = parseFloat(argument)) || n === -Infinity || n === +Infinity ? n : 0;
                exp = 0;
                len = 2 * bias + 1 + precisionBits + 3;                
                bin = new Array(len);
                signal = (n = status !== 0 ? 0 : n) < 0;
                n = Math.abs(n);
                intPart = Math.floor(n);
                floatPart = n - intPart; 
                for (k = len; k;) {
                    bin[--k] = 0;
                }
                for (k = bias + 2; intPart && k;) {                    
                    bin[--k] = intPart % 2;
                    intPart = Math.floor(intPart / 2);
                }
                for (k = bias + 1; floatPart > 0 && k; --floatPart) {
                    (bin[++k] = ((floatPart *= 2) >= 1) - 0);                
                }
                for (k = -1; ++k < len && !bin[k];) {}
 
                if (bin[(lastBit = precisionBits - 1 + (k = (exp = bias + 1 - k) >= minExp && exp <= maxExp ? k + 1 : bias + 1 - (exp = minExp - 1)) ) + 1]) {
                    if (!(rounded = bin[lastBit])) {                        
                        for (j = lastBit + 2;!rounded && j < len; rounded = bin[j++]) {}
                    }
                    for (j = lastBit + 1; rounded && --j >= 0; (bin[j] = !bin[j] - 0) && (rounded = 0)) {}
                }
 
                for (k = k - 2 < 0 ? -1 : k - 3; ++k < len && !bin[k];) {}
                 if ((exp = bias + 1 - k) >= minExp && exp <= maxExp) {
                    ++k;
                } else {
                    if (exp < minExp) {
                        if (exp !== bias + 1 - len && exp < minUnnormExp) {                            /*"encodeFloat::float underflow" */
                        }
                        k = bias + 1 - (exp = minExp - 1);
                    }
                } 
                if (intPart || status !== 0) {
                    exp = maxExp + 1;
                    k = bias + 2;
                    if (status === -Infinity) {                        
                        signal = 1;
                    } else if (isNaN(status)) {
                        bin[k] = 1;
                    }
                } 
                n = Math.abs(exp + bias);
                tmpResult = '';
 
                for (j = exponentBits + 1; --j;) {                    
                    tmpResult = (n % 2) + tmpResult;
                    n = n >>= 1;
                }
 
                n = 0;                
                j = 0;
                k = (tmpResult = (signal ? '1' : '0') + tmpResult + bin.slice(k, k + precisionBits).join('')).length;
                r = [];
                 for (; k;) {
                    n += (1 << j) * tmpResult.charAt(--k);
                    if (j === 7) {
                        r[r.length] = String.fromCharCode(n);
                        n = 0;                    }
                    j = (j + 1) % 8;
                }
 
                r[r.length] = n ? String.fromCharCode(n) : '';                result += r.join('');
                argumentPointer++;
            }
            break;
         case 'x': // NUL byte
            if (quantifier === '*') {
                throw new Error('Warning: pack(): Type x: \'*\' ignored');
            }
            for (i = 0; i < quantifier; i ++) {                result += String.fromCharCode(0);
            }
            break;

        case 'X': // Back up one byte            
            if (quantifier === '*') {
                throw new Error('Warning: pack(): Type X: \'*\' ignored');
            }
            for (i = 0; i < quantifier; i ++) {
                if (result.length === 0) {                   throw new Error('Warning: pack(): Type X:' +
                            ' outside of string');
                } else {
                    result = result.substring(0, result.length - 1);
                }            }
            break;
 
        case '@': // NUL-fill to absolute position
            if (quantifier === '*') {                throw new Error('Warning: pack(): Type X: \'*\' ignored');
            }
            if (quantifier > result.length) {
                extraNullCount = quantifier - result.length;
                for (i = 0; i < extraNullCount; i ++) {                    result += String.fromCharCode(0);
                }
            }
            if (quantifier < result.length) {
                result = result.substring(0, quantifier);            }
            break;
 
        default:
            throw new Error('Warning:  pack() Type ' + instruction +                    ': unknown format code');
        }
    }
    if (argumentPointer < arguments.length) {
        throw new Error('Warning: pack(): ' +                (arguments.length - argumentPointer) + ' arguments unused');
    }
 
    return result;
}