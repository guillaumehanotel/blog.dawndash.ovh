# Install Oh-My-Zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
# Install Zgen
git clone https://github.com/tarjoilija/zgen.git "${HOME}/.zgen"

# Install & apply dotfiles
curl -sfL https://git.io/chezmoi | sh
sudo mv bin/chezmoi /bin/chezmoi
chezmoi git@github.com:guillaumehanotel/dotfiles.git
#  <username>
#  <password>
chezmoi apply
rm -rf bin
# Apply dotfiles
source .zshrc