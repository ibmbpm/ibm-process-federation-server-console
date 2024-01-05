/*
 Copyright IBM Corp. 2023
*/

import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Grid,
  Column,
  UnorderedList,
  ListItem,
} from '@carbon/react';
import { Schematics, Xml, Portfolio, Unknown } from '@carbon/icons-react';
import ExternalLink from '../../components/ExternalLink';

function LandingPage() {
  return (
    <Grid className="landing-page" fullWidth>
      <Column lg={16} md={8} sm={4} className="landing-page__banner">
        <Breadcrumb noTrailingSlash aria-label="Page navigation">
          <BreadcrumbItem>
            <a href="/">Documentation</a>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1 className="landing-page__heading">
          IBM Process Federation Server Console
        </h1>
      </Column>
      <Column lg={16} md={8} sm={4} className="landing-page__r1">
        <Tabs defaultSelectedIndex={0}>
          <TabList className="tabs-group" aria-label="Tab navigation">
            <Tab>About</Tab>
            <Tab>Configuration</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Grid className="tabs-group-content">
                <Column
                  lg={16}
                  md={8}
                  sm={4}
                  className="landing-page__tab-content">
                  <h2 className="landing-page__subheading">
                    What is the Process Federation Server Console ?
                  </h2>
                  <p className="landing-page__p">
                    <em>Process Federation Server Console</em> is a{' '}
                    <ExternalLink href="https://carbondesignsystem.com/developing/frameworks/react/">
                      Carbon React
                    </ExternalLink>{' '}
                    web application that demonstrates how to leverage the
                    Process Federation Server's{' '}
                    <ExternalLink href="https://www.ibm.com/docs/en/baw/23.x?topic=mapfs-monitoring-process-federation-server-instances-using-runtimedata-rest-api">
                      Cluster Runtimedata REST API
                    </ExternalLink>{' '}
                    to monitor a list of{' '}
                    <em>Process Federation Server instances</em> and their{' '}
                    <em>Federated Systems</em>.
                  </p>
                  <h2 className="landing-page__subheading">
                    How to monitor Process Federation Server instances ?
                  </h2>
                  <p className="landing-page__p">
                    To monitor Process Federation Server instances, click the{' '}
                    <em>Monitoring</em> link in the header of the application
                    and select the <em>Process Federation Servers</em> view.
                  </p>
                  <p className="landing-page__p">
                    This view displays a table with an entry for each one of the
                    Process Federation Server instances that are configured for
                    monitoring.
                  </p>
                  <p className="landing-page__p">
                    This table has three columns, and one row per Process
                    Federation Server instance that is monitored. The three
                    columns display the following information for a Process
                    Federation Server instance:
                  </p>
                  <p className="landing-page__p">
                    <UnorderedList>
                      <ListItem>
                        <em>Endpoint:</em> displays the endpoint (base URL) of
                        the Process Federated Server instance, a link to the
                        Swagger UI for this instance and the HTTP status
                        returned by the runtimedata API of this instance. If the
                        HTTP status is an error status, clicking the chevron on
                        the left of the Endpoint column will reveal more
                        information about the error.
                      </ListItem>
                      <ListItem>
                        <em>Federated Systems:</em> displays a list of the
                        federated systems that are configured in the Process
                        Federation Server instance's server.xml configuration
                        file. The displayName property of the federated system
                        is used if it is defined in the server.xml configuration
                        file, or else it is replaced with the value of the id
                        property is. The display name or id of each federated
                        system is preceded by an icon that depends on the type
                        of the system:
                        <UnorderedList>
                          <ListItem>
                            <Schematics className="icon-with-text" /> indicates
                            a BPD system;
                          </ListItem>
                          <ListItem>
                            <Xml className="icon-with-text" /> indicates a BPEL
                            system;
                          </ListItem>
                          <ListItem>
                            <Portfolio className="icon-with-text" /> indicates a
                            Case system;
                          </ListItem>
                          <ListItem>
                            <Unknown className="icon-with-text" /> indicates
                            that the system type is unknown.
                          </ListItem>
                        </UnorderedList>
                        If there are issues or warnings reported for this system
                        in the Process Federation server instance, the server
                        name is higlighted by a red error box or a yellow
                        warning box. Clicking a server name in the list will
                        reveal more information about the server.
                      </ListItem>
                      <ListItem>
                        <em>Federated Data Repository:</em> displays information
                        about the federated data repository that this Process
                        Federation Server instance is configured to use. If
                        there are issues with the configured federated data
                        repository, those are directly reported in this column.
                      </ListItem>
                    </UnorderedList>
                  </p>
                  <p className="landing-page__p">
                    When a federated system is clicked in the{' '}
                    <em>Federated Systems</em> column, the following details are
                    revealed:
                  </p>
                  <p className="landing-page__p">
                    <UnorderedList>
                      <ListItem>
                        The configuration properties of the federated system in
                        the Process Federation Server instance's server.xml
                        configuration file, augmented with runtime information
                        retrieved from the system if available (system version,
                        etc...);
                      </ListItem>
                      <ListItem>
                        Information about the database (datasource) configured
                        for this federated system in the Process Federation
                        Server instance's server.xml configuration file,
                        augmented with runtime information retrieved from the
                        database if available (database version, etc...);
                      </ListItem>
                      <ListItem>
                        The retriever configured for this federated system in
                        the Process Federation Server instance's server.xml
                        configuration file, if any, along with some basic KPIs
                        about this retriever. Clicking the retriever will
                        display a popup window with more information about this
                        retriever:
                        <UnorderedList>
                          <ListItem>
                            Key performance indicators for this retriever;
                          </ListItem>
                          <ListItem>
                            Details about the at most 10 last REST API calls
                            performed by this retriever;
                          </ListItem>
                          <ListItem>
                            The at most 10 last errors reported by this
                            retriever if any;
                          </ListItem>
                          <ListItem>
                            The configuration properties of this retriever in
                            the Process Federation Server instance's server.xml
                            configuration file.
                          </ListItem>
                        </UnorderedList>
                      </ListItem>
                      <ListItem>
                        The list of indexers configured for this federated
                        system in the Process Federation Server instance's
                        server.xml configuration file, if any, along with some
                        basic KPIs about this indexer. Clicking an indexer in
                        the list will display a popup window with more
                        information about this indexer:
                        <UnorderedList>
                          <ListItem>
                            Key performance indicators for this indexer;
                          </ListItem>
                          <ListItem>
                            Details about the at most 10 last indexing cycles of
                            this indexer;
                          </ListItem>
                          <ListItem>
                            The at most 10 last errors reported by this indexer
                            if any;
                          </ListItem>
                          <ListItem>
                            The at most 10 last warning reported by this indexer
                            if any;
                          </ListItem>
                          <ListItem>
                            Information about the maintenance operations
                            performed by this indexer;
                          </ListItem>
                          <ListItem>
                            The configuration properties of this indexer in the
                            Process Federation Server instance's server.xml
                            configuration file, augmented with runtime
                            properties (such as the consumer column that this
                            indexer uses in the change log table) when
                            available.
                          </ListItem>
                        </UnorderedList>
                        If there is more than one indexer configured for the
                        federated system for the process federation server
                        instance, the selector on the top of the popup window
                        can be used to switch from one indexer to the others.
                      </ListItem>
                    </UnorderedList>
                  </p>
                  <p className="landing-page__p">
                    To refresh the content of the Process Federation Servers
                    view, either the browser refresh button or the Autotoggle
                    toggle on top of the Monitoring view (and in the retriever
                    and indexer popup windows) can be used. Activating the
                    Autorefresh toggle cause the content of the view to be
                    automatically updated every 5 seconds.
                  </p>
                  <h2 className="landing-page__subheading">
                    How to monitor Federated Systems ?
                  </h2>
                  <p className="landing-page__p">
                    To monitor Federated Systems, click the <em>Monitoring</em>{' '}
                    link in the header of the application and select the{' '}
                    <em>Federated Systems</em> view.
                  </p>
                  <p className="landing-page__p">
                    This view displays a table with an entry for each one of the
                    Federated Systems that are configured across the monitored
                    Process Federation Server instances.
                  </p>
                  <p className="landing-page__p">
                    This table has three columns, and one row per Federated
                    System instance. The three columns display the following
                    information for a Federated System instance:
                  </p>
                  <p className="landing-page__p">
                    <UnorderedList>
                      <ListItem>
                        <em>System:</em> displays the display name or id of the
                        Federated System (if different display names or ids are
                        used in each Process Federation Server instance's
                        server.xml configuration files, one of them will be used
                        at random here), and a link to the REST API of this
                        system that returns details information about it. If
                        critical configuration properties for this system have
                        different values across the monitored Process Federation
                        Server instances, a <em>Configuration Error</em> status
                        is also reported in this column: clicking the chevron to
                        the left of the column will display more information
                        about the system and the configuration errors will be
                        highlighted.
                      </ListItem>
                      <ListItem>
                        <em>Retrievers Status:</em> displays a consolidated
                        status for the retrievers configured for this system
                        across the monitored Process Federation Server
                        instances.
                      </ListItem>
                      <ListItem>
                        <em>Indexers Status:</em> displays a consolidated status
                        for the indexers configured for this system across the
                        monitored Process Federation Server instances.
                      </ListItem>
                    </UnorderedList>
                  </p>
                  <p className="landing-page__p">
                    When the chevron on the left of a Federated System's row is
                    clicked, the following details are revealed:
                  </p>
                  <p className="landing-page__p">
                    <UnorderedList>
                      <ListItem>
                        The configuration properties of the federated system
                        across the monitored Process Federation Server
                        instance's server.xml configuration files, augmented
                        with runtime information retrieved from the system if
                        available (system version, etc...); If any mismatch is
                        detected in the Federated System configuration across
                        the monitored Process Federation Server instances, it is
                        highlighted in here and the different values provided in
                        each Process Federation Server instance's server.xml
                        configuration files are listed.
                      </ListItem>
                      <ListItem>
                        Information about the database (datasource) configured
                        for this federated system across the monitored Process
                        Federation Server instance's server.xml configuration
                        file, augmented with runtime information retrieved from
                        the database if available (database version, etc...); If
                        any mismatch is detected in the Federated System
                        database configuration across the monitored Process
                        Federation Server instances, it is highlighted in here
                        and the different values provided in each Process
                        Federation Server instance's server.xml configuration
                        files are listed.
                      </ListItem>
                      <ListItem>
                        The retrievers configured for this federated system
                        across the Process Federation Server instance's
                        server.xml configuration files, along with some basic
                        KPIs about each retriever. Clicking a retriever will
                        display a popup window with more information about this
                        retriever:
                        <UnorderedList>
                          <ListItem>
                            Key performance indicators for this retriever;
                          </ListItem>
                          <ListItem>
                            Details about the at most 10 last REST API calls
                            performed by this retriever;
                          </ListItem>
                          <ListItem>
                            The at most 10 last errors reported by this
                            retriever if any;
                          </ListItem>
                          <ListItem>
                            The configuration properties of this retriever in
                            the Process Federation Server instance's server.xml
                            configuration file.
                          </ListItem>
                        </UnorderedList>
                        If there is more than one retriever configured for the
                        federated system, the selector on the top of the popup
                        window can be used to switch from one retriever to the
                        others.
                      </ListItem>
                      <ListItem>
                        The list of indexers configured for this federated
                        system across the Process Federation Server instance's
                        server.xml configuration files, along with some basic
                        KPIs about this indexer. Clicking an indexer in the list
                        will display a popup window with more information about
                        this indexer:
                        <UnorderedList>
                          <ListItem>
                            Key performance indicators for this indexer;
                          </ListItem>
                          <ListItem>
                            Details about the at most 10 last indexing cycles of
                            this indexer;
                          </ListItem>
                          <ListItem>
                            The at most 10 last errors reported by this indexer
                            if any;
                          </ListItem>
                          <ListItem>
                            The at most 10 last warning reported by this indexer
                            if any;
                          </ListItem>
                          <ListItem>
                            Information about the maintenance operations
                            performed by this indexer;
                          </ListItem>
                          <ListItem>
                            The configuration properties of this indexer in the
                            Process Federation Server instance's server.xml
                            configuration file, augmented with runtime
                            properties (such as the consumer column that this
                            indexer uses in the change log table) when
                            available.
                          </ListItem>
                        </UnorderedList>
                        If there is more than one indexer configured for the
                        federated system, the selector on the top of the popup
                        window can be used to switch from one indexer to the
                        others.
                      </ListItem>
                    </UnorderedList>
                  </p>
                  <p className="landing-page__p">
                    To refresh the content of the Federated Systems view, either
                    the browser refresh button or the Autotoggle toggle on top
                    of the Monitoring view (and in the retriever and indexer
                    popup windows) can be used. Activating the Autorefresh
                    toggle cause the content of the view to be automatically
                    updated every 5 seconds.
                  </p>
                </Column>
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid className="tabs-group-content">
                <Column
                  lg={16}
                  md={8}
                  sm={4}
                  className="landing-page__tab-content">
                  <h2 className="landing-page__subheading">
                    How to configure Process Federation Server instances for
                    monitoring ?
                  </h2>
                  <p className="landing-page__p">
                    The Process Federation Server{' '}
                    <em> Cluster Runtimedata REST API </em> need to be
                    configured on each Process Federation Server instance to
                    monitor.
                  </p>
                  <p className="landing-page__p">
                    In the <em>server.xml</em> configuration file of each
                    Process Federation Server instance, the following
                    configuration element must be defined with a comma separated
                    list of the base URLs of all the Process Federation Server
                    instances to monitor:
                  </p>
                  <p className="landing-page__p">
                    <code>
                      &lt;ibmPfs_console
                      pfsNodesEndpoints="https://pfs1.my.domain:9444,https://pfs2.my.domain:9444"
                      /&gt;
                    </code>
                  </p>
                  <Button
                    className="learn-more-button"
                    href="https://www.ibm.com/docs/en/baw/23.x?topic=management-enabling-process-federation-server"
                    target="_blank">
                    Learn more
                  </Button>
                </Column>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Column>
    </Grid>
  );
}

export default LandingPage;
