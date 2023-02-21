import { Command, Flags } from '@oclif/core';

import { handleGeocodeFile } from '../../handlers/geocode-handler';
import { CLIError } from '@oclif/errors';

export default class Geocode extends Command {
  static description = 'Gecoode';

  static examples = ['geocode --filename=data/addresses.xlsx --apiKey=somekey --outputFile=data/geocodeoutput.zip'];

  static flags = {
    filename: Flags.string({ char: 'f', description: 'Path and name of Excel file of address data to geocode', required: true }),
    apiKey: Flags.string({
      description: `Here API Key - if not specified it's expected to be contained within your terminal environment`,
      required: false,
      char: 'a',
    }),
    outputFile: Flags.string({ char: 'o', description: 'Path and name of file to write output to', required: false }),
  };

  static summary = `This tool is used to geocode addresses in a provided Microsoft Excel spreadsheet. For this to work, the headings of the columns are required to be as follows:
   
  address_id - used to reference the provided address in the output (recId in output)
  name - the name of the address or first part (optional)
  address - the address itself (optional)
  second_address -  the second part of the address (optional)  
  third_address - the third part of the address (optional)
  city - the city of the address (optional)
  postcode - the postcode of the address (optional)
  country -  the country of the address (optional)
  
  If present, each of the name, address, second_address, third_address, city and postcode fields will be concatenated together and used as 'searchText' in the request
  
  The output is created as an Excel workbook. 
  
  Note: You may get multiple results in the output for a single line when the HERE Maps Geocoder returns multiple results for a provided address.
  When this is the case the seqLength field will be > 0 for a given recId 
  `;

  async run(): Promise<void> {
    const { flags } = await this.parse(Geocode);

    this.log(`Geocoding ${flags.filename}`);
    try {
      if (flags.outputFile && !flags.outputFile.includes('.xlsx')) {
        throw new CLIError('outputFile must have .xlsx extension');
      }
      await handleGeocodeFile(flags.filename, flags.apiKey || null, flags.outputFile);
    } catch (err) {
      this.error(err as Error);
    }
  }
}
