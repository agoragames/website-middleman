---
title: Ruby Reversible Encryption
author: An Engineer
---
It's been awhile since I had to do anything with reversible encryption. Here's a working sample using AES.

```ruby
#/usr/bin/ruby
require 'openssl'
require "base64"
require 'uri'

# First lets encrypt the string!
plaintext = 'Super secret message'

# Create the cipher
cipher = OpenSSL::Cipher::Cipher.new("aes-256-cbc")
cipher.encrypt # Tell OpenSSL to operate in encrypt mode
puts "Cipher wants a key that is #{cipher.key_len}"
key = '01234567890123456789012345678901'
cipher.key = key

puts "Cipher wants an initialization vector that is #{cipher.iv_len}"
cipher.iv = iv = cipher.random_iv # Create and set a random initialization vector

# Encrypted
encrypted = cipher.update(plaintext) + cipher.final
encrypted = iv + encrypted # Send along the IV

# Lets pretty up the encrypted string
encrypted = Base64.encode64(encrypted)
#encrypted = URI.escape(encrypted, Regexp.new("[^#{URI::PATTERN::UNRESERVED}]"))
encrypted = URI.escape(encrypted)



# Now lets unencrypt it, first start with a new cipher
cipher = OpenSSL::Cipher::Cipher.new("aes-256-cbc")
cipher.decrypt # Use SSL in decrypt mode
cipher.key = key
encrypted = URI.unescape(encrypted)
encrypted = Base64.decode64(encrypted)
cipher.iv = encrypted.slice!(0,16) # Remove the IV from the encrypted data
decrypted = cipher.update(encrypted) + cipher.final

# Test
puts 'The original was '+ plaintext
puts 'Encrypted that was ' + encrypted
puts 'Decrypted we have ' + decrypted
```
