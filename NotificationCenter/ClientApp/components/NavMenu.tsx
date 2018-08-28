import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { NotificationPrompt } from './NotificationPrompt/NotificationPrompt';
export class NavMenu extends React.Component<{}, {}> {
    public render() {
        return <div className='main-nav'>
            <div className='navbar navbar-inverse'>
                <div className='navbar-header'>
                    <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
                        <span className='sr-only'>Toggle navigation</span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                    </button>
                    <Link className='navbar-brand' to={'/'}>NotificationCenter</Link>
                </div>
                <div className='clearfix'></div>
                <div className='navbar-collapse collapse'>
                    <ul className='nav navbar-nav'>
                        <li>
                            <NavLink to={'/'} exact activeClassName='active'>
                                <span className='glyphicon glyphicon-home'></span> Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/notifications/list'} activeClassName='active'>
                                <span className='glyphicon glyphicon-comment'></span> Notifiche
                                </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/groups/list'} activeClassName='active'>
                                <span className='glyphicon glyphicon-list-alt'></span> Liste di inoltro
                                </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/device/list'} activeClassName='active'>
                                <span className='glyphicon glyphicon-link'></span> Device registrati
                                </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/notifications/sent'} activeClassName='active'>
                                <span className='glyphicon glyphicon-send'></span> Notifiche inviate
                                </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>;
    }
}
