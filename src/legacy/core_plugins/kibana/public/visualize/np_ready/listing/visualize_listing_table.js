/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@kbn/i18n/react';
import { i18n } from '@kbn/i18n';
import { TableListView } from '../../../../../../../plugins/kibana_react/public';

import { EuiIcon, EuiBetaBadge, EuiLink, EuiButton, EuiEmptyPrompt } from '@elastic/eui';

import { getServices } from '../../kibana_services';

class VisualizeListingTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { visualizeCapabilities, uiSettings, toastNotifications } = getServices();
    return (
      <TableListView
        headingId="visualizeListingHeading"
        // we allow users to create visualizations even if they can't save them
        // for data exploration purposes
        createItem={this.props.createItem}
        findItems={this.props.findItems}
        deleteItems={visualizeCapabilities.delete ? this.props.deleteItems : null}
        editItem={visualizeCapabilities.save ? this.props.editItem : null}
        tableColumns={this.getTableColumns()}
        listingLimit={this.props.listingLimit}
        selectable={item => item.canDelete}
        initialFilter={''}
        noItemsFragment={this.getNoItemsMessage()}
        entityName={i18n.translate('kbn.visualize.listing.table.entityName', {
          defaultMessage: 'visualization',
        })}
        entityNamePlural={i18n.translate('kbn.visualize.listing.table.entityNamePlural', {
          defaultMessage: 'visualizations',
        })}
        tableListTitle={i18n.translate('kbn.visualize.listing.table.listTitle', {
          defaultMessage: 'Visualizations',
        })}
        toastNotifications={toastNotifications}
        uiSettings={uiSettings}
      />
    );
  }

  getTableColumns() {
    const tableColumns = [
      {
        field: 'title',
        name: i18n.translate('kbn.visualize.listing.table.titleColumnName', {
          defaultMessage: 'Title',
        }),
        sortable: true,
        render: (field, record) => (
          <EuiLink
            href={this.props.getViewUrl(record)}
            data-test-subj={`visListingTitleLink-${record.title.split(' ').join('-')}`}
          >
            {field}
          </EuiLink>
        ),
      },
      {
        field: 'typeTitle',
        name: i18n.translate('kbn.visualize.listing.table.typeColumnName', {
          defaultMessage: 'Type',
        }),
        sortable: true,
        render: (field, record) => (
          <span>
            {this.renderItemTypeIcon(record)}
            {record.typeTitle}
            {this.getBadge(record)}
          </span>
        ),
      },
      {
        field: 'description',
        name: i18n.translate('kbn.dashboard.listing.table.descriptionColumnName', {
          defaultMessage: 'Description',
        }),
        sortable: true,
        render: (field, record) => <span>{record.description}</span>,
      },
    ];

    return tableColumns;
  }

  getNoItemsMessage() {
    if (this.props.hideWriteControls) {
      return (
        <div>
          <EuiEmptyPrompt
            iconType="visualizeApp"
            title={
              <h1 id="visualizeListingHeading">
                <FormattedMessage
                  id="kbn.visualize.listing.noItemsMessage"
                  defaultMessage="Looks like you don't have any visualizations."
                />
              </h1>
            }
          />
        </div>
      );
    }

    return (
      <div>
        <EuiEmptyPrompt
          iconType="visualizeApp"
          title={
            <h1 id="visualizeListingHeading">
              <FormattedMessage
                id="kbn.visualize.listing.createNew.title"
                defaultMessage="Create your first visualization"
              />
            </h1>
          }
          body={
            <Fragment>
              <p>
                <FormattedMessage
                  id="kbn.visualize.listing.createNew.description"
                  defaultMessage="You can create different visualizations, based on your data."
                />
              </p>
            </Fragment>
          }
          actions={
            <EuiButton
              onClick={this.props.createItem}
              fill
              iconType="plusInCircle"
              data-test-subj="createVisualizationPromptButton"
            >
              <FormattedMessage
                id="kbn.visualize.listing.createNew.createButtonLabel"
                defaultMessage="Create new visualization"
              />
            </EuiButton>
          }
        />
      </div>
    );
  }

  renderItemTypeIcon(item) {
    let icon;
    if (item.image) {
      icon = (
        <img className="visListingTable__typeImage" aria-hidden="true" alt="" src={item.image} />
      );
    } else {
      icon = (
        <EuiIcon
          className="visListingTable__typeIcon"
          aria-hidden="true"
          type={item.icon || 'empty'}
          size="m"
        />
      );
    }

    return icon;
  }

  getBadge(item) {
    if (item.stage === 'beta') {
      return (
        <EuiBetaBadge
          className="visListingTable__betaIcon"
          label="B"
          title={i18n.translate('kbn.visualize.listing.betaTitle', {
            defaultMessage: 'Beta',
          })}
          tooltipContent={i18n.translate('kbn.visualize.listing.betaTooltip', {
            defaultMessage:
              'This visualization is in beta and is subject to change. The design and code is less mature than official GA ' +
              'features and is being provided as-is with no warranties. Beta features are not subject to the support SLA of official GA ' +
              'features',
          })}
        />
      );
    } else if (item.stage === 'experimental') {
      return (
        <EuiBetaBadge
          className="visListingTable__experimentalIcon"
          label="E"
          title={i18n.translate('kbn.visualize.listing.experimentalTitle', {
            defaultMessage: 'Experimental',
          })}
          tooltipContent={i18n.translate('kbn.visualize.listing.experimentalTooltip', {
            defaultMessage:
              'This visualization might be changed or removed in a future release and is not subject to the support SLA.',
          })}
        />
      );
    }
  }
}

VisualizeListingTable.propTypes = {
  deleteItems: PropTypes.func.isRequired,
  findItems: PropTypes.func.isRequired,
  createItem: PropTypes.func.isRequired,
  getViewUrl: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
  listingLimit: PropTypes.number.isRequired,
};

const withI18nContext = I18nContext => props => (
  <I18nContext>
    <VisualizeListingTable {...props} />
  </I18nContext>
);

export { withI18nContext };
