# Mattermost AI Plugin

> Mattermost plugin for local and third-party LLMs

![The Mattermost AI Plugin is an extension for mattermost that provides functionality for local and third-party LLMs](https://github.com/mattermost/openops/assets/7295363/37cc5337-16a0-4d88-971f-71cd0cdc52e9)

<!-- omit from toc -->
## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Background

The Mattermost AI Plugin adds functionality for local (self-hosted) and third-party (vendor-hosted) LLMs within Mattermost.

This plugin is currently experimental. Contributions and suggestions are welcome. See the [Contributing](#contributing) section for more details!

Mattermost AI Plugin is also part of the [Mattermost OpenOps](https://openops.mattermost.com) framework for responsible development of AI-enhanced workflows.

Join the discussion in the [~AI-Exchange channel](https://community.mattermost.com/core/channels/ai-exchange) and explore the [Discourse forum](https://forum.mattermost.com/c/openops-ai/40). 💬

## Install

These installation instructions assume you already have a [Mattermost instance](https://mattermost.com/download/) with [PostgreSQL](https://www.postgresql.org/):

1. Download the [latest release](https://github.com/mattermost/mattermost-plugin-ai/releases) of the Mattermost AI Plugin
2. Log in to Mattermost as an administrator
3. Upload the `*.tar.gz` to your server via **System Console** ➡️ **Plugin Management**. See [this documentation](https://developers.mattermost.com/integrate/plugins/using-and-managing-plugins/#custom-plugins) for help.
4. Enable the Mattermost AI Plugin via **System Console** ➡️ **Mattermost AI Plugin**.
5. Follow the [configuration guide](./docs/configuration-guide.md) to set up the Mattermost AI Plugin.

## Usage

After following the [configuration guide](./docs/configuration-guide.md) to connect your LLM to Mattermost, there many ways to integrate AI into your collaboration workflows. To help you get started, check out the examples in the [Usage](./docs/usage.md) documentation. 🚀

## Contributing

Interested in contributing to our open source project? Start by reviewing the [contributor guidelines](./.github/CONTRIBUTING.md) for this repository.

## License

This repository is licensed under [Apache-2](./LICENSE), except for the [server/enterprise](server/enterprise) directory which is licensed under the [Mattermost Source Available License](LICENSE.enterprise). See [Mattermost Source Available License](https://docs.mattermost.com/overview/faq.html#mattermost-source-available-license) to learn more.
