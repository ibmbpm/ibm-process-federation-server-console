/*
 Copyright IBM Corp. 2023
*/

import { fireEvent, render, screen } from '@testing-library/react';
import FederatedSystemModalHeading from '../../../datamodel/federatedsystem/FederatedSystemModalHeading';
import { Bee } from '@carbon/pictograms-react';

test(`FederatedSystemModalHeading `, async () => {
  // test data
  const icon = <Bee />;
  const label = 'Federated System Modal Heading Test';
  const items = ['item1', 'item2', 'item3', 'item4'];
  const selectedItem = 'item3';
  const changeHandler = jest.fn();

  // create the component to test
  const { container } = render(
    <FederatedSystemModalHeading
      icon={icon}
      label={label}
      items={items}
      selectedItem={selectedItem}
      changeHandler={changeHandler}
    />
  );

  //***** check general structure by expecting following elements :
  // a <div> with class 'federated-system-modal-heading-stack'
  expect(
    container.querySelector('.federated-system-modal-heading-stack')
  ).not.toBeNull();
  // a <div> with class 'cds--dropdown' and/or id "federated-system-modal-heading-dropdown"
  const dropdown = container.querySelector('.cds--dropdown');
  expect(dropdown).not.toBeNull();
  expect(dropdown).toHaveAttribute(
    'id',
    'federated-system-modal-heading-dropdown'
  );
  // an element with role 'img' and name "Open menu"
  expect(screen.getByRole('img', { name: 'Open menu' })).toBeDefined();
  // a text 'Federated System Modal Heading Test'
  expect(screen.getByText(label)).toBeDefined();

  // check that ONLY the selected item is displayed
  expect(screen.getByText(selectedItem)).toBeDefined();
  expect(screen.queryByText(items[0])).toBeNull();
  expect(screen.queryByText(items[1])).toBeNull();
  expect(screen.queryByText(items[3])).toBeNull();

  //***** simulate user selection in the list
  // click on the combobox
  const btn = screen.getByRole('combobox');
  expect(btn).toBeDefined();
  fireEvent.click(btn);

  // click the combobox should have displayed all items.
  // Note: selected item should appear twice: one in combobox and onein list; that's why we use getAllByText
  items.forEach(item => {
    expect(screen.getAllByText(item)).toBeDefined();
  });

  // now click on an item, that should call the changeHandler function
  const item = screen.getByRole('option', { name: items[0] });
  fireEvent.click(item);
  expect(changeHandler).toHaveBeenCalledTimes(1);
});
