import { Octokit } from '@octokit/core';

const octokit = new Octokit({
  auth: process.env.GITHUB_PA_TOKEN
});

interface keyMap {
  username: string;
  publicKeys: string[];
}

export const getSSHKeysForUser = async (user: string): Promise<keyMap> => {
  const data = await octokit
    .request(`GET /users/${user}/keys`, { username: user })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(
        `Error getting public SSH keys for user ${user}. Got status: ${err.status}`
      );
      return [];
    });

  return Promise.resolve({
    username: user,
    publicKeys: data.map(({ key }: { key: string }) => key)
  });
};

export const getSSHKeys = async (users: string[]) => {
  return await Promise.all(users.map(getSSHKeysForUser));
};

(async () => {
  // Get keys for a single user
  console.log(await getSSHKeysForUser('ghost'));

  // Get keys for multiple users
  console.log(await getSSHKeys(['ghost', 'raisedadead']));
})();
