export class LoginPage {
  constructor(page) {
    this.page = page;

    
    this.favorites       = page.getByText('Избранное');
    this.settings        = page.locator('.settings-icon');
    this.profile = page.locator('.icon-user');
    this.loginButtonOpen = page.locator('.settings-login-btn');

    
    this.modal = page.locator('.regm-overlay').first();

   
    this.switchToLoginTab = page.locator('.regm-switch-btn');

    
    this.emailInput = page.locator('.logm-input[name="email"]');
    this.passwordInput = page.locator('.logm-input[name="password"]');

    
    this.loginButtonSubmit = page.locator('.logm-login-btn');

    
    this.errorMessage = this.modal.locator('.error, .error-message');
  }

  async goto() {
    await this.page.goto('http://russify.k-lab.su');
  }

 
  async _openModalAndSwitchToLogin() {
    await this.modal.waitFor({ state: 'visible' });
    await this.switchToLoginTab.click();
  }

  
  async openLoginViaSettings() {
    await this.settings.click();
    await this.loginButtonOpen.waitFor({ state: 'visible' });
    await this.loginButtonOpen.click();
    await this._openModalAndSwitchToLogin();
  }

 
  async openLoginViaFavorites() {
    await this.favorites.click();
    await this._openModalAndSwitchToLogin();
  }

  
  async openLoginViaProfile() {
    await this.profile.click();
    await this._openModalAndSwitchToLogin();
  }

  
  async login(email, password) {
    await this.emailInput.waitFor({ state: 'visible' });
    await this.passwordInput.waitFor({ state: 'visible' });

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    await this.loginButtonSubmit.click();
  }

  
  async loginViaSettings(email, password) {
    await this.openLoginViaSettings();
    await this.login(email, password);
  }

  async loginViaFavorites(email, password) {
    await this.openLoginViaFavorites();
    await this.login(email, password);
  }

  async loginViaProfile(email, password) {
    await this.openLoginViaProfile();
    await this.login(email, password);
  }
}