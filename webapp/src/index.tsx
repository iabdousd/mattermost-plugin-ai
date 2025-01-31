import React from 'react';
import {Store, Action} from 'redux';
import styled from 'styled-components';

import {GlobalState} from '@mattermost/types/lib/store';

//@ts-ignore it exists
import aiIcon from '../../assets/bot_icon.png';

import manifest from '@/manifest';

import {LLMBotPost} from './components/llmbot_post';
import PostMenu from './components/post_menu';
import IconThreadSummarization from './components/assets/icon_thread_summarization';
import IconReactForMe from './components/assets/icon_react_for_me';
import RHS from './components/rhs/rhs';
import Config from './components/system_console/config';
import {doReaction, doSummarize, doTranscribe, getAIDirectChannel} from './client';
import {setOpenRHSAction} from './redux_actions';
import {BotUsername} from './constants';
import PostEventListener from './websocket';
import {setupRedux} from './redux';
import UnreadsSumarize from './components/unreads_summarize';
import IconAI from './components/assets/icon_ai';
import {doSelectPost} from './hooks';

type WebappStore = Store<GlobalState, Action<Record<string, unknown>>>

const StreamingPostWebsocketEvent = 'custom_mattermost-ai_postupdate';

const IconAIContainer = styled.img`
	border-radius: 50%;
    width: 24px;
    height: 24px;
`;

const RHSTitleContainer = styled.span`
    display: flex;
	gap: 8px;
    align-items: center;
	margin-left: 8px;
`;

const SummarizeRecordingIconContainer = styled.span`
	color: rgba(var(--center-channel-color-rgb), 0.56);
`;

const RHSTitle = () => {
    return (
        <RHSTitleContainer>
            <IconAIContainer src={aiIcon}/>
            {'AI Assistant'}
        </RHSTitleContainer>
    );
};

const isProcessableAudio = (fileInfo: any) => {
    const acceptedExtensions = [
        'mp3',
        'mp4',
        'mpeg',
        'mpga',
        'm4a',
        'wav',
        'webm',
    ];

    return acceptedExtensions.includes(fileInfo.extension);
};

export default class Plugin {
    postEventListener: PostEventListener = new PostEventListener();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public async initialize(registry: any, store: WebappStore) {
        setupRedux(registry, store);

        let rhs: any = null;
        if ((window as any).Components.CreatePost) {
            rhs = registry.registerRightHandSidebarComponent(RHS, RHSTitle);
            setOpenRHSAction(rhs.showRHSPlugin);

            registry.registerReducer((state = {}, action: any) => {
                switch (action.type) {
                case 'SET_AI_BOT_CHANNEL':
                    return {
                        ...state,
                        botChannelId: action.botChannelId,
                    };
                case 'SELECT_AI_POST':
                    return {
                        ...state,
                        selectedPostId: action.postId,
                    };
                default:
                    return state;
                }
            });
        }

        let currentUserId = store.getState().entities.users.currentUserId;
        if (currentUserId) {
            getAIDirectChannel(currentUserId).then((botChannelId) => {
                store.dispatch({type: 'SET_AI_BOT_CHANNEL', botChannelId} as any);
            });
        }

        store.subscribe(() => {
            const state = store.getState();
            if (state && state.entities.users.currentUserId !== currentUserId) {
                currentUserId = state.entities.users.currentUserId;
                if (currentUserId) {
                    getAIDirectChannel(currentUserId).then((botChannelId) => {
                        store.dispatch({type: 'SET_AI_BOT_CHANNEL', botChannelId} as any);
                    });
                } else {
                    store.dispatch({type: 'SET_AI_BOT_CHANNEL', botChannelId: ''} as any);
                }
            }
        });

        registry.registerWebSocketEventHandler(StreamingPostWebsocketEvent, this.postEventListener.handlePostUpdateWebsockets);
        const LLMBotPostWithWebsockets = (props: any) => {
            return (
                <LLMBotPost
                    {...props}
                    websocketRegister={this.postEventListener.registerPostUpdateListener}
                    websocketUnregister={this.postEventListener.unregisterPostUpdateListener}
                />
            )
            ;
        };

        registry.registerPostTypeComponent('custom_llmbot', LLMBotPostWithWebsockets);
        if (registry.registerPostActionComponent) {
            registry.registerPostActionComponent(PostMenu);
        } else {
            registry.registerPostDropdownMenuAction(<><span className='icon'><IconThreadSummarization/></span>{'Summarize Thread'}</>, (postId: string) => {
                const state = store.getState();
                const team = state.entities.teams.teams[state.entities.teams.currentTeamId];
                window.WebappUtils.browserHistory.push('/' + team.name + '/messages/@' + BotUsername);
                doSummarize(postId);
                if (rhs) {
                    store.dispatch(rhs.showRHSPlugin);
                }
            });
            registry.registerPostDropdownMenuAction(<><span className='icon'><IconReactForMe/></span>{'React for me'}</>, doReaction);
        }

        registry.registerAdminConsoleCustomSetting('Config', Config);
        if (rhs) {
            registry.registerChannelHeaderButtonAction(<IconAIContainer src={aiIcon}/>, () => {
                store.dispatch(rhs.toggleRHSPlugin);
            });
        }

        if (registry.registerNewMessagesSeparatorActionComponent) {
            registry.registerNewMessagesSeparatorActionComponent(UnreadsSumarize);
        }

        registry.registerFileDropdownMenuAction(isProcessableAudio, <><SummarizeRecordingIconContainer className='icon'><IconAI/></SummarizeRecordingIconContainer>{'Summarize recording'}</>, async (fileInfo: any) => {
            const result = await doTranscribe(fileInfo.post_id, fileInfo.id);
            doSelectPost(result.postid, result.channelid, store.dispatch);
        });
    }
}

declare global {
    interface Window {
        registerPlugin(pluginId: string, plugin: Plugin): void
        WebappUtils: any
    }
}

window.registerPlugin(manifest.id, new Plugin());
