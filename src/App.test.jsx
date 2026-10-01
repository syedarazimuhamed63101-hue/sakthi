import { expect, test } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App, { DashboardPage } from './App';

test('renders the Sakthi Property brand', () => {
  render(<App />);
  expect(screen.getByText(/sakthi property/i)).toBeDefined();
});

test('starts with no sample properties, tenants, or rent records', () => {
  render(<App />);
  expect(screen.getByText('No properties yet')).toBeDefined();
  expect(screen.queryByText('Sakthi Residency')).toBeNull();
  expect(screen.queryByText('Anitha Kumar')).toBeNull();

  fireEvent.click(screen.getByRole('button', { name: 'Rent Management' }));
  expect(screen.getByText('No current rent records')).toBeDefined();
});

test('dashboard rent totals exclude records from other years', () => {
  const now = new Date();
  const month = now.toLocaleDateString('en-US', { month: 'long' });
  const tenants = [{
    id: 'tenant-1',
    fullName: 'Current Tenant',
    status: 'Active',
    rentHistory: [
      { month, year: now.getFullYear() - 1, amount: 9000, status: 'Paid' },
      { month, year: now.getFullYear(), amount: 1200, status: 'Paid' },
      { month, year: now.getFullYear(), amount: 300, status: 'Pending' },
    ],
  }];

  render(<DashboardPage properties={[]} tenants={tenants} bills={[]} notifications={[]} setPage={() => {}} />);

  expect(screen.getByRole('button', { name: /Rent Collected/ }).textContent).toContain('₹1,200');
  expect(screen.getByRole('button', { name: /Rent Pending/ }).textContent).toContain('₹300');
});
