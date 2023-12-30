#!/bin/bash

# Determine which shell is being used
# Note the below will likely cause issues with Windows unless the user has WSL installed
SHELL_PROFILE=
if [ -n "$ZSH_VERSION" ]; then
    SHELL_PROFILE="${HOME}/.zshrc"
elif [ -n "$BASH_VERSION" ]; then
    SHELL_PROFILE="${HOME}/.bashrc"
else
    echo "Unsupported shell."
    return 1
fi

RUNNING_IN_DOCKER=
if grep -qa container=lxc /proc/1/environ; then
    echo RUNNING_IN_DOCKER=true
fi

install_nodejs(){
  # Check if Node.js is installed. If it isn't, install NVM and add to profile
  if ! command -v node &> /dev/null; then
      # Install Node Version Manager (NVM)
      curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
      export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
      [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

      # Install Node.js using NVM
      nvm install 21
      nvm use 21

      # Make sure nvm is loaded into shell
       if ! grep -q 'NVM_DIR="$HOME/.nvm"' "$SHELL_PROFILE"; then
            echo 'export NVM_DIR="$HOME/.nvm"' >> "$SHELL_PROFILE"
            echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm' >> "$SHELL_PROFILE"
        fi
  fi
}

install_nodejs_packages(){
  # Check if pnpm is installed
  if ! command -v pnpm &> /dev/null; then
      echo "User doesn't have pnpm installed, installing it now..."
      npm install -g pnpm
  fi

  # Check if Neon Bindings CLI is installed
#  if ! command -v neon &> /dev/null; then
#      echo "User doesn't have Neon Bindings CLI installed, installing it now..."
#      npm install -g neon-cli
#  fi
# Check if Neon Serverless in installed
  if ! command -v neonctl &> /dev/null; then
      echo "User doesn't have Neon Serverless CLI installed, installing it now..."
      npm install -g neonctl
  fi
}

sign_in_to_neon_serverless(){
  echo "Signing into Neon Serverless..."
  local credentials_json_path="$HOME/.config/neonctl/credentials.json"
  if [[ -n "$RUNNING_IN_DOCKER" && -z "$NEON_API_KEY" && ! -f "$credentials_json_path" ]];
  then
    echo "WARNING: You're running this in a docker container.
    You should copy your Neon Serverless credentials.json file or set
    the NEON_API_KEY environment variable since you won't be able to
    sign in with a browser"
  fi

  local has_neon_api_key
  [[ -n "$NEON_API_KEY" ]] && has_neon_api_key="Set" || has_neon_api_key="Not set"
  local has_credentials_file
  [[ -f "$credentials_json_path" ]] && has_credentials_file="Exists" || has_credentials_file="Not present"
  echo "Checking if user has instantiated Neon Serverless"
  echo "NEON_API_KEY: $has_neon_api_key, credentials.json: $has_credentials_file"
  if [[ ! -f "$credentials_json_path" && -z "$NEON_API_KEY" ]]; then
    echo "User has not set NEON_API_KEY and doesn't have a neonctl credentials.json file. Signing into Neon Serverless..."
    neonctl auth
  else
    echo "User has already signed into Neon Serverless"
  fi
}


#TODO
# 1. Check if project exists with neonctl projects list or neonctl projects get decentralinked
# 2. If it doesn't exist, create it now (outputs below): neonctl projects create --name decentralinked
# Project
#┌────────────────────────┬────────────────┬───────────────┬──────────────────────┐
#│ Id                     │ Name           │ Region Id     │ Created At           │
#├────────────────────────┼────────────────┼───────────────┼──────────────────────┤
#│ patient-night-07066027 │ decentralinked │ aws-us-east-2 │ 2023-12-29T14:48:05Z │
#└────────────────────────┴────────────────┴───────────────┴──────────────────────┘
#Connection URIs
#┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
#│ Connection Uri                                                                                    │
#├───────────────────────────────────────────────────────────────────────────────────────────────────┤
#│ postgres://unelected_rubdown859:<PASSWORD>@ep-late-frog-08114160.us-east-2.aws.neon.tech/neondb │
#└───────────────────────────────────────────────────────────────────────────────────────────────────┘
# 3. Get the connection string (this method is only reliable on fresh installations): neonctl connection-string main
# 4. Set the NEON_CONNECTION_STRING environment variables

install_nodejs
install_nodejs_packages
# TODO install Rust when/if we start using rust-lib
sign_in_to_neon_serverless




# In docker, you'll want to check

# Check if Koyeb is installed
#KOYEB_BIN=$(which koyeb)

# Check if koyeb is a part of the PATH
#if [ -n "$KOYEB_BIN" ]; then
#    echo "koyeb was not found in path, checking if exists in default install location"
#    if [ -f "$HOME/.koyeb/bin/koyeb" ]; then
#        echo "WARNING: koyeb was found in $HOME/.koyeb/bin/koyeb, but isn't in PATH"
#        KOYEB_BIN="$HOME/.koyeb/bin/koyeb"
#    else
#      echo "koyeb was not found in default install location"
#      echo "Installing koyeb-cli..."
#      curl https://raw.githubusercontent.com/koyeb/koyeb-cli/master/install.sh | sh
#      echo "Adding koyeb cli to PATH in"
#    fi
#fi