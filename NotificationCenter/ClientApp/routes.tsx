import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Notification } from './components/Notification/Notification';
import { NotificationGroup } from './components/NotificationGroup/NotificationGroup';
import NotificationList from './components/NotificationList/NotificationList';
import NotificationGroupList from './components/NotificationGroupList.tsx/NotificationGroupList';
import DeviceList from './components/DeviceList/DeviceList';
import Device from './components/Device/Device';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />

    <Route path='/notifications/edit/:id' render={(props) => (<Notification {...props} />)} />
    <Route path='/notifications/add' render={(props) => (<Notification {...props} />)} />
    <Route path='/notifications/list' component={NotificationList} />

    <Route path='/groups/edit/:id' render={(props) => (<NotificationGroup {...props} />)} />
    <Route path='/groups/add' render={(props) => (<NotificationGroup {...props} />)} />
    <Route path='/groups/list' component={NotificationGroupList} />

    <Route path='/device/list' component={DeviceList} />
    <Route path='/device/edit/:id' render={(props) => (<Device {...props} />)} />
</Layout>;
