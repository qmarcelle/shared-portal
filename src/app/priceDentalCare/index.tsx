'use client';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Filter } from '@/components/foundation/Filter';
import { externalIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';
import { FilterItem } from '@/models/filter_dropdown_details';
import { logger } from '@/utils/logger';
import { useCallback, useMemo, useState } from 'react';
import DentalIcon from '../../../public/assets/dental.svg';
import { getProcedureCost } from './actions/getProcedureCost';
import { PriceDentalCareCard } from './components/PriceDentalCareCard';
import { Network, Networks } from './models/network';
import { ProcedureCostResponse } from './models/procedureCostResponse';
import { Procedure, ProcedureResponse } from './models/procedureResponse';

export type PriceDentalCareProps = {
  networks: Networks;
  categories: ProcedureResponse;
};

export const getCategoryDropdownValues = (categories: ProcedureResponse) => {
  logger.info('Mapping Categories to dropdown values');
  let i: number = 2;
  return categories.procedureCategories.map((category) => ({
    label: category.name,
    value: category.id.toString(),
    id: '' + i++,
  }));
};

export const getNetworkDropdownValues = (networks: Network[]) => {
  logger.info('Mapping networks to dropdown values');
  let i: number = 2;
  return networks.map((network) => ({
    label: network.networkDesc,
    value: network.networkPrefix,
    id: '' + i++,
  }));
};

export const getProcedureDropdownValues = (procedures: Procedure[]) => {
  logger.info('Mapping procedures to dropdown values');
  let i: number = 2;
  return procedures.map((procedure) => ({
    label: procedure.name,
    value: procedure.code,
    id: '' + i++,
  }));
};

const PriceDentalCare = ({ networks, categories }: PriceDentalCareProps) => {
  const [showEstimateCost, setShowEstimateCost] = useState(false);

  const [procedureCost, setProcedureCost] = useState<ProcedureCostResponse>({
    costEstimate: {
      customaryCost: '',
      networkMinAllowance: '',
      networkMaxAllowance: '',
    },
  });

  const handleDentalCard = async (showEstimateCost: boolean) => {
    try {
      const response = await getProcedureCost(
        currentSelectedZipCode.toString(),
        currentSelectedProcedure.value.toString(),
        currentSelectedNetwork.value.toString(),
      );
      setProcedureCost(response);
      console.log('procedureCost:', JSON.stringify(response));
      setShowEstimateCost(showEstimateCost);
    } catch (error) {
      console.error('Error fetching procedure cost:', error);
    }
  };

  const networkDropdownValues = useMemo(
    () => getNetworkDropdownValues(networks.networks),
    [networks],
  );

  const categoryDropdownValues = useMemo(
    () => getCategoryDropdownValues(categories),
    [categories],
  );

  type procedureOption = {
    label: string;
    value: string;
    id: string;
  };

  const [procedureDropdownValues, setProcedureDropdownValues] = useState<
    procedureOption[]
  >([]);

  const [currentSelectedZipCode, setcurrentSelectedZipCode] = useState('');

  const onZipCodeChange = useCallback(
    (zipCode: string | undefined) => {
      if (zipCode === undefined) {
        console.log('zipCode is undefined');
        return;
      }
      console.log(`zipCode: ${zipCode}`);
      setcurrentSelectedZipCode(zipCode);
    },
    [setcurrentSelectedZipCode],
  );

  const [currentSelectedNetwork, setCurrentSelectedNetwork] = useState({
    label: 'Choose Network',
    value: '1',
    id: '1',
  });

  const onNetworkSelectionChange = useCallback(
    (selectedNetwork: string | undefined) => {
      if (selectedNetwork === undefined) {
        console.log('Selected network is undefined');
        return;
      }
      console.log(`Selected Network: ${selectedNetwork}`);
      const network = networkDropdownValues.find(
        (item) => item.value === selectedNetwork,
      );
      if (network === undefined) {
        console.log('Selected network not found');
        return;
      }
      setCurrentSelectedNetwork(network);
    },
    [networkDropdownValues, setCurrentSelectedNetwork],
  );

  const [currentSelectedCategory, setCurrentSelectedCategory] = useState({
    label: 'Select Category',
    value: '1',
    id: '1',
  });

  const onCategorySelectChange = useCallback(
    (selectedCategory: string | undefined) => {
      if (selectedCategory === undefined) {
        console.log('Selected category is undefined');
        return;
      }
      console.log(`Selected category: ${selectedCategory}`);
      const category = categoryDropdownValues.find(
        (item) => item.value === selectedCategory,
      );
      const procedureCategory = categories.procedureCategories.find(
        (item) => item.id === parseInt(selectedCategory),
      );
      if (category === undefined) {
        console.log('Selected category not found');
        return;
      }
      setCurrentSelectedCategory(category);
      setCurrentSelectedProcedure({
        label: 'Select Procedure',
        value: '1',
        id: '1',
      });
      setProcedureDropdownValues(
        getProcedureDropdownValues(procedureCategory!.procedures),
      );
    },
    [categoryDropdownValues, setCurrentSelectedCategory],
  );

  const [currentSelectedProcedure, setCurrentSelectedProcedure] = useState({
    label: 'Select Procedure',
    value: '1',
    id: '1',
  });

  const onProcedureSelectChange = useCallback(
    (selectedProcedure: string | undefined) => {
      if (selectedProcedure === undefined) {
        console.log('Selected procedure is undefined');
        return;
      }
      console.log(`Selected Procedure: ${selectedProcedure}`);
      const procedure = procedureDropdownValues!.find(
        (item: any) => item.value === selectedProcedure,
      );
      if (procedure === undefined) {
        console.log('Selected procedure not found');
        return;
      }
      setCurrentSelectedProcedure(procedure);
    },
    [procedureDropdownValues, setCurrentSelectedProcedure],
  );

  function onFilterSelectChange(index: number, data: FilterItem[]) {
    if (index == 0) onNetworkSelectionChange(data[index].selectedValue?.value);
    else if (index == 1)
      onCategorySelectChange(data[index].selectedValue?.value);
    else if (index == 2)
      onProcedureSelectChange(data[index].selectedValue?.value);
    else if (index == 3) onZipCodeChange(data[index].selectedInputValue);
  }

  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color !p-0">
        <Title className="title-1" text="Price Dental Care" />
        <section className="flex justify-start self-start">
          <RichText
            spans={[
              <Row key={0}>
                We&apos;ll help give you a better idea of what your dental care
                will cost. We base these costs on the type of care you need and
                where you live.
              </Row>,
            ]}
          />
        </section>

        <section className="flex flex-row items-start app-body" id="Filter">
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <Filter
              className="small-section px-0 m-0  md:w-[288px] w-auto"
              filterHeading="Filter Dental Costs"
              onReset={() => {}}
              showReset={false}
              buttons={{
                className: 'font-bold',
                type: 'primary',
                label: 'Estimate Cost',
                callback: (value) => {
                  handleDentalCard(value);
                },
              }}
              isMultipleItem={true}
              isCallbackValid={
                currentSelectedZipCode !== '' &&
                currentSelectedProcedure.value !== '1' &&
                currentSelectedNetwork.value !== '1'
              }
              filterItems={[
                {
                  type: 'dropdown',
                  label: 'Dental Network',
                  value: [
                    {
                      label: 'Choose Network',
                      value: '1',
                      id: '1',
                    },
                    ...networkDropdownValues,
                  ],
                  selectedValue: currentSelectedNetwork,
                },
                {
                  type: 'dropdown',
                  label: 'Category',
                  value: [
                    {
                      label: 'Select Category',
                      value: '1',
                      id: '1',
                    },
                    ...categoryDropdownValues,
                  ],
                  selectedValue: currentSelectedCategory,
                },
                {
                  type: 'dropdown',
                  label: 'Procedure',
                  value: [
                    {
                      label: 'Select Procedure',
                      value: '1',
                      id: '1',
                    },
                    ...procedureDropdownValues,
                  ],
                  selectedValue: currentSelectedProcedure,
                },
                {
                  type: 'input',
                  label: 'Zip Code',
                  value: currentSelectedZipCode,
                  selectedInputValue: currentSelectedZipCode,
                },
              ]}
              onSelectCallback={(index, data) => {
                onFilterSelectChange(index, data);
              }}
            />
          </Column>
          <Spacer axis="horizontal" size={32} />
          {procedureCost && procedureCost.costEstimate ? (
            <>
              <Column className="flex-grow page-section-63_33 items-stretch">
                <PriceDentalCareCard
                  procedures={[
                    {
                      id: '1',
                      label: 'Find a Dentist',
                      body: 'Get started searching for a dentist near you.',
                      icon: DentalIcon,
                      link: externalIcon,
                    },
                  ]}
                  showEstimateCost={showEstimateCost}
                  procedureSelected={currentSelectedProcedure.label}
                  customaryCost={procedureCost.costEstimate!.customaryCost}
                  networkAllowanceCost={
                    procedureCost.costEstimate!.networkMaxAllowance
                  }
                />
              </Column>
            </>
          ) : (
            <>
              <Card className="cardColor mt-4">
                <Column className={'flex flex-col'}>
                  <TextBox
                    className="body-1 center mt-4 ml-4"
                    text="We're not able to load cost estimator right now. Please try again later."
                  />
                </Column>
              </Card>
            </>
          )}
        </section>
      </Column>
    </main>
  );
};

export default PriceDentalCare;
