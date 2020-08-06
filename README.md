# Open Polkassembly

Open Polkassembly was created for Hackfs. It is a fork of https://github.com/paritytech/polkassembly/ leveraging IPFS and Textile ThreadsDB to bring Polkassembly from a privacy preserving yet centralized platform to web3 standards, without compromising on UX.

Open Polkassembly is the place to discuss and vote on Kusama and Polkadot governance. Any post or comment is hosted both on a fast centralized server, and on IPFS. For each post, a "censorship status" is shown in form of a gray (checking), green (all good), red (don't trust what you read).
You can click this status to refresh it.

Open Polkassembly front-end is hosted on IPFS and is available using the fleek domain: https://open-polkassembly.on.fleek.co/ (also hosted separately and available using the following IPNS peer id https://bafzbeiezlca63rdn2sqzl6kub2yhsnnpckumufl34yfwmxi7mqfwcoavne.ipns.dweb.link/)

## Examples:

The post available on https://open-polkassembly.on.fleek.co/post/3/ is genuine and no malicious actor has ever changed the data on the centralized DB.  
As a result, the status check is green, and the data presented to the users can be trusted:
![image](https://user-images.githubusercontent.com/33178835/89531681-ed34ba00-d7f0-11ea-805d-a8e186cf797d.png)


As a proof, I've manually changed the data on the centralized DB for the following post: https://open-polkassembly.on.fleek.co/post/9/  
As a result, the status check is red, the data was modified and this thread should no be trusted.
![image](https://user-images.githubusercontent.com/33178835/89531617-d1c9af00-d7f0-11ea-8864-5d6a2cf01112.png)



---

This repo hosts
- front-end: the React front-end application available on https://open-polkassembly.on.fleek.co/
- auth-server: the nodeJS backend and its db responsible for user authentication.
- hasura: the docker that host the discussion db as well as the graphQL server that exposes the db to the Polkassembly application.
- chain-db-watcher: a nodeJS service creating or updating the discussion db as soon as governance events happen on-chain.


`launch.sh` is a script that helps (first stop and then) launch the dockers and servers in the right order as well as applying the migrations for the different db.
