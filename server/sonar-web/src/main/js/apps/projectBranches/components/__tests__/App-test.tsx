/*
 * SonarQube
 * Copyright (C) 2009-2019 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { getValues } from '../../../../api/settings';
import {
  mockLongLivingBranch,
  mockMainBranch,
  mockPullRequest,
  mockShortLivingBranch
} from '../../../../helpers/testMocks';
import App from '../App';

jest.mock('../../../../api/settings', () => ({
  getValues: jest.fn(() => Promise.resolve([]))
}));

beforeEach(() => {
  jest.clearAllMocks();
});

it('renders sorted list of branches', () => {
  const branchLikes = [
    mockMainBranch(),
    mockLongLivingBranch(),
    mockShortLivingBranch(),
    mockPullRequest(),
    mockShortLivingBranch({ mergeBranch: 'foobar', name: 'feature', isOrphan: true })
  ];
  const wrapper = shallow(
    <App
      branchLikes={branchLikes}
      canAdmin={true}
      component={{ key: 'foo' }}
      onBranchesChange={jest.fn()}
    />
  );
  wrapper.setState({ branchLifeTime: '100', loading: false });
  expect(wrapper).toMatchSnapshot();
});

it('fetches branch life time setting on mount', () => {
  mount(<App branchLikes={[]} component={{ key: 'foo' }} onBranchesChange={jest.fn()} />);
  expect(getValues).toBeCalledWith({
    keys: 'sonar.dbcleaner.daysBeforeDeletingInactiveShortLivingBranches'
  });
});
