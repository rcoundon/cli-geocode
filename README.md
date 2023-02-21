oclif-hello-world
=================

<!-- toc -->
* [Usage](#usage)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g cli-geocode
$ cli-geocode COMMAND
running command...
$ cli-geocode (--version)
cli-geocode/0.1.0 darwin-arm64 node-v18.14.0
$ cli-geocode --help [COMMAND]
USAGE
  $ cli-geocode COMMAND
...
```
<!-- usagestop -->

## `cli-geocode geocode`

This tool is used to geocode addresses in a provided Microsoft Excel spreadsheet. For this to work, the headings of the columns are required to be as follows:

```
USAGE
  $ cli-geocode geocode -f <value> [-a <value>] [-o <value>]

FLAGS
  -a, --apiKey=<value>      Here API Key - if not specified it's expected to be contained within your terminal
                            environment
  -f, --filename=<value>    (required) Path and name of Excel file of address data to geocode
  -o, --outputFile=<value>  Path and name of file to write output to

DESCRIPTION
  This tool is used to geocode addresses in a provided Microsoft Excel spreadsheet. For this to work, the headings of
  the columns are required to be as follows:

  address_id - used to reference the provided address in the output (recId in output)
  name - the name of the address or first part (optional)
  address - the address itself (optional)
  second_address -  the second part of the address (optional)
  third_address - the third part of the address (optional)
  city - the city of the address (optional)
  postcode - the postcode of the address (optional)
  country -  the country of the address (optional)

  If present, each of the name, address, second_address, third_address, city and postcode fields will be concatenated
  together and used as 'searchText' in the request

  The output is created as an Excel workbook.

  Note: You may get multiple results in the output for a single line when the HERE Maps Geocoder returns multiple
  results for a provided address.
  When this is the case the seqLength field will be > 0 for a given recId


  Gecoode

EXAMPLES
  geocode --filename=data/addresses.xlsx --apiKey=somekey --outputFile=data/geocodeoutput.zip
```

## `cli-geocode help [COMMANDS]`

Display help for cli-geocode.

```
USAGE
  $ cli-geocode help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for cli-geocode.
```

<!-- commandsstop -->
