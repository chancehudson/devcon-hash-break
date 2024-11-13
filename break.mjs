import { sha256 } from "js-sha256";
import { poseidon1} from 'poseidon-lite'
import fs from 'fs/promises'

import { keccak256 } from "ethers/crypto"
import { toBeHex } from "ethers/utils"

export default function hash(message) {
    return (BigInt(keccak256(toBeHex(message, 32))) >> BigInt(8)).toString()
}

// curious
// const target = BigInt('0xe761be04f45373e0206a3fa2e56dd7650fadf457de098ce1ade717f1199bef3')
// powerful
// const target = BigInt('0x1be2cb2c4128c38261b7d550032944d5c7072dc5d4367458d1acfbb03dbfee75')
// free
const target = BigInt('0x20aa66b1a1b546ddfadd9ca28d9a8a8fdbd08245d55c371b09a38dd5aecbf4e1')

const words = (await fs.readFile(`./words.txt`)).toString().split('\n')

for (let w of words) {
  let input = w.toLowerCase().trim()
  input = BigInt("0x" + sha256(input))
  let messageHash = poseidon1([BigInt(hash(input))])
//console.log(messageHash, target)
  if (messageHash === target) {
    console.log(`found it: ${w}`)
  } 
}
process.exit()

function* generateWordsOfLength(length) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const totalCombinations = Math.pow(26, length);
    
    for (let i = 0; i < totalCombinations; i++) {
        let word = '';
        let num = i;
        
        // Convert number to base-26 representation
        for (let j = 0; j < length; j++) {
            word = alphabet[num % 26] + word;
            num = Math.floor(num / 26);
        }
        
        yield word.padStart(length, 'a');
    }
}

for (let x = 1; x < 10; x++) {
// Example usage:
const iterator = generateWordsOfLength(x);
let count = 0
for (const combination of iterator) {
  const input = combination.toLowerCase().trim()
if (++count % 10000 === 0) console.log(input)
  const messageHash = BigInt("0x" + sha256(input))
  if (messageHash === target) {
    console.log(`found it: ${input}`)
  } 
}
}



process.exit()

// search the set of lowercase letters, a-z incrementally updating

let preimage = 'a'
let letters_nums = 'abcdefghijklmnopqrstuvwxyz'.split('')
let letters_nums_map = letters_nums.reduce((acc, v, k) => {
  return {
    ...acc,
    [v]: k
  }
}, {})
while (preimage.length < 10) {
  if (preimage[preimage.length - 1] == 'z') {
    preimage = `${preimage}a`
  } else {
    let next_letter_index = letters_nums_map[preimage[preimage.length - 1]] + 1
    preimage = `${preimage.slice(0, preimage.length-1)}${letters_nums[next_letter_index]}`
  }
console.log(preimage)
}
